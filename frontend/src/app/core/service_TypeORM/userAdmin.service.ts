import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { UserAdmin } from '../models_TypeORM/userAdmin.model';
import { environment_Admin } from '../../../environments_Admin/environment_Admin';
import { JwtAdminService } from './jwt_Admin.service';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private baseUrl = `${environment_Admin.api_url}/userAdmin`;
  private currentUserSubject = new BehaviorSubject<UserAdmin | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private jwtService: JwtAdminService) {}

  attemptAuth(authType: string, credentials: { email: string; password: string }): Observable<{ admin_access_token: string, usertype: string, username: string, email: string }> {
    const endpoint = authType === 'register' ? '/register' : '/login';
    return this.http.post<{ admin_access_token: string, usertype: string, username: string, email: string }>(`${this.baseUrl}${endpoint}`, credentials).pipe(
      tap(response => {
        this.jwtService.saveToken(response.admin_access_token);

        const userAdmin: UserAdmin = {
          usertype: response.usertype,
          username: response.username,
          email: response.email,
          isActive: true,
          permissions: [],
          userEnterpriseIds: []
        };

        this.setAuth(userAdmin);
        this.populate();
      }),
      catchError(error => {
        console.error('Error durante la autenticación de administrador:', error);
        throw error;
      })
    );
  }


  populate() {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<{ userAdmin: UserAdmin }>(`${this.baseUrl}/current_user`, { headers }).subscribe(
        data => {
          if (data && data.userAdmin) {
            this.setAuth(data.userAdmin);
          } else {
            this.purgeAuth();
          }
        },
        err => {
          console.error(`Error fetching admin data (${err.status}):`, err.message);
          this.purgeAuth();
        }
      );
    } else {
      this.purgeAuth();
    }
  }


  getAccessToken(): string | null {
    return this.jwtService.getToken();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  }

  getCurrentUser(): UserAdmin | null {
    return this.currentUserSubject.value;
  }

  private setAuth(userAdmin: UserAdmin) {
    this.currentUserSubject.next(userAdmin);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  logout() {
    this.purgeAuth();
  }

  login(authType: string, credentials: { email: string; password: string }): Observable<void> {
    return new Observable<void>(observer => {
      this.attemptAuth(authType, credentials).subscribe(
        response => {
          this.jwtService.saveToken(response.admin_access_token);
          observer.next();
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

}

