import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model'; 
import { map, distinctUntilChanged, switchMap, takeWhile } from 'rxjs/operators';
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


  private accessTokenExpirationTimer: any;
  private refreshTokenExpirationTimer: any;//No toques perro es par saber el temps que falta per a 
                                    //  caducar el token pa debugg, en com ho toques te arranque la ma


  constructor (
    private http: HttpClient, 
    private jwtService: JwtService
  ) {}


  populate() {
    if (this.jwtService.getAccessToken()) {
      this.http.get(`${this.apiUrl}/user`).subscribe(
        (data: any) => {
          if (data && data.user) {
            this.setAuth(data.user);
          } else {
            this.purgeAuth();
          }
        },
        () => {
          this.purgeAuth();
        }
      );
    } else {
      this.purgeAuth();
    }
  }


  setAuth(user: User) {
    this.jwtService.saveTokens(user.token, user.refreshToken);  
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);


    this.startTokenExpirationTimers(user.token, user.refreshToken);//debugging
  }

  purgeAuth() {
    this.jwtService.destroyTokens(); 
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  
  
    this.stopTokenExpirationTimer();//debugging
  }


  refreshToken(): Observable<User> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {})
      .pipe(
        map((data: any) => {
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            this.setAuth({ 
              ...currentUser, 
              token: data.accessToken, 
              refreshToken: data.refreshToken 
            });
            return currentUser;
          }
          throw new Error('Current user not found');
        })
      );
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




  /**____________________________DEBUG ZONE____________________________________________ */
  private startTokenExpirationTimers(accessToken: string, refreshToken: string) {
    this.stopTokenExpirationTimers();
    
    this.startTokenTimer(accessToken, 'Access');
    this.startTokenTimer(refreshToken, 'Refresh');
  }

  private startTokenTimer(token: string, tokenType: string) {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    if (timeUntilExpiration > 0) {
      const timer = interval(1000).pipe(
        takeWhile(() => Date.now() < expirationTime)
      ).subscribe(() => {
        const remainingTime = Math.round((expirationTime - Date.now()) / 1000);
        console.log(`${tokenType} token expires in ${remainingTime} seconds`);
      });

      if (tokenType === 'Access') {
        this.accessTokenExpirationTimer = timer;
      } else {
        this.refreshTokenExpirationTimer = timer;
      }
    } else {
      console.log(`${tokenType} token has already expired`);
    }
  }

  private stopTokenExpirationTimers() {
    if (this.accessTokenExpirationTimer) {
      this.accessTokenExpirationTimer.unsubscribe();
    }
    if (this.refreshTokenExpirationTimer) {
      this.refreshTokenExpirationTimer.unsubscribe();
    }
  }
}
