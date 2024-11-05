import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { UserEnterprise } from '../models_prisma/userEnterprise.model';
import { environments_Enterprise } from '../../../environments_Enterprise/environment_Enterprise';
import { JwtEnterpriseService } from './jwt_Enterprise.service';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserEnterpriseService {
  private baseUrl = `${environments_Enterprise.api_url}/userEnterprises`;
  private currentUserSubject = new BehaviorSubject<UserEnterprise | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private jwtService: JwtEnterpriseService) {}
  
  attemptAuth(authType: string, credentials: { email: string; password: string }): Observable<{ access_token: string, usertype: string }> {
    const endpoint = authType === 'register' ? '/register' : '/login';
    return this.http.post<{ access_token: string, usertype: string, username: string, email: string, isActive: boolean }>(`${this.baseUrl}${endpoint}`, credentials).pipe(
      tap(response => {

        // console.log('Authentication response:', response);
        // return
        if (!response.isActive && authType === 'login' && response.usertype === 'enterprise' ) {
          Swal.fire({
            icon: 'error',
            title: 'Account Inactive',
            text: 'Your account is inactive. Please contact support.',
          });
          throw new Error('Account is inactive');
        }
        this.jwtService.saveToken(response.access_token);
        const userEnterprise: UserEnterprise = {
          usertype: 'enterprise',
          username: response.username,  
          email: response.email,        
        };
        this.setAuth(userEnterprise);
        this.populate(); 
      }),
      catchError(error => {
        console.error('Error during authentication', error);
        throw error;
      })
    );
  }

  populate() {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) { 
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<{ userEnterprise: UserEnterprise }>(`${this.baseUrl}/current_user`, { headers }).subscribe(
        data => {
          if (data && data.userEnterprise) {
            this.setAuth(data.userEnterprise);
          } else {
            this.purgeAuth();  
          }
        },
        err => {
          console.error(`Error fetching user data (${err.status}):`, err.message);
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

  getCurrentUser(): UserEnterprise | null {
    return this.currentUserSubject.value;
  }

  private setAuth(userEnterprise: UserEnterprise) {
    this.currentUserSubject.next(userEnterprise);
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

  registerEnterprise(userData: any): Observable<UserEnterprise> {
    return this.http.post<UserEnterprise>(`${this.baseUrl}/register`, userData);
  }

  login(authType: string, credentials: { email: string, password: string }): Observable<void> {
    return new Observable<void>(observer => {
      this.attemptAuth(authType, credentials).subscribe(
        response => {
          this.jwtService.saveToken(response.access_token);
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
