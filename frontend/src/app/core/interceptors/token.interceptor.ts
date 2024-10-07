import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtService } from '../service/jwt.service';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../service/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.jwtService.getAccessToken();

    // Si existe un token, añadirlo a las cabeceras de la solicitud
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el token expira y recibimos un error 401, intentamos refrescar el token
        if (error.status === 401) {
          return this.userService.refreshToken().pipe(
            switchMap((newUser) => {
              // Guardar el nuevo token en el servicio y actualizar la solicitud
              token = this.jwtService.getAccessToken();
              if (token) {
                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                });
              }
              return next.handle(request);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
