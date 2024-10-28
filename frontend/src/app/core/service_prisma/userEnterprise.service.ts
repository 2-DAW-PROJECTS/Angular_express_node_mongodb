import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { UserEnterprise } from '../models_prisma/userEnterprise.model';
import { environments_Enterprise } from '../../../environments_Enterprise/environment_Enterprise';
import { JwtEnterpriseService } from './jwt_Enterprise.service';
import { tap, catchError } from 'rxjs/operators';

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
    return this.http.post<{ access_token: string, usertype: string, username: string, email: string }>(`${this.baseUrl}${endpoint}`, credentials).pipe(
      tap(response => {
        this.jwtService.saveToken(response.access_token);
  
        const usertype: 'enterprise' = response.usertype as 'enterprise'; 
        const userEnterprise: UserEnterprise = {
          usertype,
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
  
  getCurrentUser(): UserEnterprise | null {
    return this.currentUserSubject.value;
  }
  
  populate() {
    const token = this.jwtService.getToken();
    if (token) {
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