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


  private tokenExpirationTimer: any;//No toques perro es par saber el temps que falta per a 
                                    //  caducar el token pa debugg, en com ho toques te arranque la ma


  constructor (
    private http: HttpClient, 
    private jwtService: JwtService
  ) {}


  populate() {
    const accessToken = this.jwtService.getAccessToken();
    const refreshToken = this.jwtService.getRefreshToken();
  
    if (accessToken && refreshToken) {
      this.http.get<{user: User}>(`${this.apiUrl}/user`).subscribe(
        (data) => {
          if (data && data.user) {
            const user: User = {
              ...data.user,
              token: accessToken,
              refreshToken: refreshToken
            };


            console.log('Complete user data:', user);


            this.setAuth(user, accessToken);

            this.startTokenExpirationTimer(accessToken, user.refreshToken);
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
  
  
  


  setAuth(user: User, accesToken: string) {

    // console.log('User setAuth:', user);

    // console.log(accesToken);
    // console.log(user.refreshToken);

    this.jwtService.saveTokens(accesToken, user.refreshToken);  
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);



    this.startTokenExpirationTimer(accesToken, user.refreshToken);//debugging
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

          console.log('Current user:', currentUser);

          if (currentUser) {
            const updatedUser = { 
              ...currentUser, 
              token: data.accessToken, 
              refreshToken: data.refreshToken 
            };
            this.setAuth(updatedUser, data.accesToken);
            return updatedUser;
          }
          throw new Error('Current user not found');
        })
      );
  }



  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = (type === 'login') ? '/users/login' : '/users';
    return this.http.post(`${this.apiUrl}${route}`, { user: credentials })
      .pipe(map((data: any) => {
        // console.log('Login response:', data);
        // console.log('User data:', data.user);
        // console.log('Access token:', data.user.accessToken);
        // console.log('Refresh token:', data.user.refreshToken);
        this.setAuth(data.user, data.user.accessToken);
        return data;
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
        
        if (currentTime >= accessExpiration && currentTime < refreshExpiration) {
          console.log('Access token expired. Using refresh token to get a new one.');
          this.refreshToken().subscribe();
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
