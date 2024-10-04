import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient directamente
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';  // Asegúrate de que esta ruta es correcta
import { map, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // Importa environment para la URL base

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private apiUrl = environment.api_url;  // URL base desde environment

  constructor (
    private http: HttpClient, // Usa HttpClient directamente
    private jwtService: JwtService
  ) {}

  // Método para cargar el usuario si hay un token
  populate() {
    const token = this.jwtService.getToken();
    if (token) {
      this.http.get(`${this.apiUrl}/user`).subscribe(
        (data: any) => {  
          return this.setAuth({ ...data.user, token });
        },
        (err: any) => this.purgeAuth()  
      );
    } else {
      this.purgeAuth();
    }
  }

  // Método para establecer la autenticación del usuario
  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  // Método para limpiar la autenticación
  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }

  // Método para manejar el login o el registro
  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = (type === 'login') ? '/users/login' : '/users';
    return this.http.post(`${this.apiUrl}${route}`, { user: credentials })  // Usa la URL completa directamente
      .pipe(map((data: any) => {
          this.setAuth(data.user);
          return data.user;
      }));
  }

  // Obtener el usuario actual
  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Actualizar el usuario
  update(user: User): Observable<User> {
    return this.http.put(`${this.apiUrl}/user`, { user })  // Usa la URL completa directamente
      .pipe(map((data: any) => {
        this.currentUserSubject.next(data.user);
        return data.user;
      }));
  }
}
