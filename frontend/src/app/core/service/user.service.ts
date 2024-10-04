import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model'; 
import { map, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private apiUrl = environment.api_url; 
  constructor (
    private http: HttpClient, 
    private jwtService: JwtService
  ) {}

  populate() {
    const token = this.jwtService.getToken();
    // console.log('Token en populate:', token);

    if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.get(`${this.apiUrl}/user`, { headers }).subscribe(
            (data: any) => {
                // console.log('Datos del usuario:', data); 
                if (data && data.user) {
                    this.setAuth({ ...data.user, token });
                } else {
                    console.error('No se encontró el usuario en la respuesta');
                    this.isAuthenticatedSubject.next(false);
                    this.currentUserSubject.next(null);
                }
            },
            (err: any) => {
                console.error('Error al obtener el usuario:', err);
                this.isAuthenticatedSubject.next(false);
                this.currentUserSubject.next(null);
            }
        );
    } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
    }
}

  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = (type === 'login') ? '/users/login' : '/users';
    return this.http.post(`${this.apiUrl}${route}`, { user: credentials })
      .pipe(map((data: any) => {
          this.setAuth(data.user);
          return data.user;
      }));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  update(user: User): Observable<User> {
    return this.http.put(`${this.apiUrl}/user`, { user })
      .pipe(map((data: any) => {
        this.currentUserSubject.next(data.user);
        return data.user;
      }));
  }
}
