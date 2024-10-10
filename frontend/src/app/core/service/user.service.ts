import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, interval, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model'; 
import { map, distinctUntilChanged, switchMap, takeWhile, tap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  // public currentUser = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private purgeAuth$ = new Subject<void>();


  private apiUrl = environment.api_url; 
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient, 
    private jwtService: JwtService,
  ) {}



  populate() {
    const accessToken = this.jwtService.getAccessToken();
    const refreshToken = this.jwtService.getRefreshToken();
  
    if (accessToken && refreshToken) {
      if (this.isTokenExpiringSoon(refreshToken)) {
        this.refreshToken().subscribe(
          () => this.fetchUserData(),
          error => {
            console.error('Error refreshing token:', error);
            this.purgeAuth();
          }
        );
      } else {
        this.fetchUserData();
      }
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  
      this.http.get<{ user: User }>(`${this.apiUrl}/user`, { headers }).subscribe(
        (data) => {
          if (data && data.user) {
            const user: User = {
              ...data.user,
              token: accessToken,
              refreshToken: refreshToken
            };
            this.setAuth(user, accessToken);
          } else {
            this.purgeAuth();
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.purgeAuth();
        }
      );
    } else {
      this.purgeAuth();
    }
  }
  
  
  private isTokenExpiringSoon(token: string, thresholdSeconds: number = 60): boolean {
    
    try {
      console.log('Checking token expiration...');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() > expirationTime - thresholdSeconds * 1000;
    } catch (e) {
      return true; 
    }
  }


  private fetchUserData() {
    const accessToken = this.jwtService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  
    this.http.get<{ user: User }>(`${this.apiUrl}/user`, { headers }).subscribe(
      (data) => {
        if (data && data.user) {
          const refreshToken = this.jwtService.getRefreshToken();
          if (refreshToken && accessToken) {
            const user: User = {
              ...data.user,
              token: accessToken,
              refreshToken: refreshToken
            };
            this.setAuth(user, accessToken);
          } else {
            this.purgeAuth();
          }
        } else {
          this.purgeAuth();
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.purgeAuth();
      }
    );
  }

  setAuth(user: User, accessToken: string) {
    // console.log('User setAuth:', user);
    // console.log(accessToken);
    // console.log(user.refreshToken);
    this.startTokenExpirationCheck();
    this.jwtService.saveTokens(accessToken, user.refreshToken);  
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.startTokenExpirationTimer(accessToken, user.refreshToken);//debugging
  }

  purgeAuth() {
    this.jwtService.destroyTokens(); 
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.purgeAuth$.next();
  
    this.stopTokenExpirationTimer();//debugging
  }

  logout() {
    const refreshToken = this.jwtService.getRefreshToken();
    return this.http.post(`${this.apiUrl}/users/logout`, { refreshToken }).pipe(
      map(() => {
        this.purgeAuth();
      })
    );
  }

  private startTokenExpirationCheck() {
    interval(5000) // Check every 10 seconds
      .pipe(
        takeUntil(this.purgeAuth$)
      )
      .subscribe(() => {
        const refreshToken = this.jwtService.getRefreshToken();
        if (refreshToken && this.isTokenExpiringSoon(refreshToken)) {
          this.refreshToken().subscribe(
            () => {},
            error => {
              console.error('Error refreshing token:', error);
              this.purgeAuth();
            }
          );
        }
      });
  }
  
    
  refreshToken(): Observable<void> {
    const currentRefreshToken = this.jwtService.getRefreshToken();
    
    return this.http.post<{accessToken: string, refreshToken: string}>(`${this.apiUrl}/refresh-token`, { refreshToken: currentRefreshToken }).pipe(
      tap(tokens => {
        if (tokens.refreshToken === currentRefreshToken) {
          this.logout().subscribe();
        } else {
          this.jwtService.saveTokens(tokens.accessToken, tokens.refreshToken);
          this.fetchUserData(); // This will update the stored user data
        }
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error refreshing token:', error);
        this.logout().subscribe();
        throw error;
      })
    );
  }
  
    

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.getValue();
    if (user) {
      // console.log('Current user retrieved:', user);
      return user;
    } else {
      console.log('No current user found');
      return null;
    }
  }
  


  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = (type === 'login') ? '/users/login' : '/users';
    return this.http.post(`${environment.api_url}${route}`, { user: credentials })
      .pipe(map((data: any) => {
        // console.log('Data received:', data);
        // console.log('Data.user:', data.user.accessToken);

        this.setAuth(data.user, data.user.accessToken);
        return data;
      }));
  }



  update(user: User): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtService.getAccessToken()}`);
    return this.http.put(`${environment.api_url}/user`, { user }, { headers })
      .pipe(tap((data: any) => {
        this.currentUserSubject.next(data.user);
      }));
  }

  /**____________________________DEBUG ZONE____________________________________________ */
  private startTokenExpirationTimer(accessToken: string, refreshToken: string) {

    // console.log(accessToken, refreshToken);

    this.stopTokenExpirationTimer();
    
    const decodeToken = (token: string) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    };
  
    const accessTokenPayload = decodeToken(accessToken);
    const refreshTokenPayload = decodeToken(refreshToken);
    
    if (accessTokenPayload && refreshTokenPayload) {
      const accessExpiration = accessTokenPayload.exp * 1000;
      const refreshExpiration = refreshTokenPayload.exp * 1000;
  
      this.tokenExpirationTimer = interval(1000).pipe(
        takeWhile(() => Date.now() < refreshExpiration)
      ).subscribe(() => {
        const currentTime = Date.now();
        const accessRemaining = Math.max(0, Math.round((accessExpiration - currentTime) / 1000));
        const refreshRemaining = Math.max(0, Math.round((refreshExpiration - currentTime) / 1000));
        
        console.log(`Access token expires in ${accessRemaining}s,\n Refresh token expires in ${refreshRemaining}s`);
        
        if (refreshRemaining <= 0) {
          // console.log('El usuario se va a deslogear');
          // window.location.reload();
          this.refreshToken();
        }
      });
    } else {
      console.error('Invalid tokens');
    }
  }

  private stopTokenExpirationTimer() {
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
    }
  }
}
