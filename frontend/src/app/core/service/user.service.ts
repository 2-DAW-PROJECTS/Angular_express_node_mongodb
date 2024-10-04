// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
// import { JwtService } from './jwt.service';
// import { User } from '../models/user.model';
// import { map, distinctUntilChanged } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private currentUserSubject = new BehaviorSubject<User>({} as User);
//   public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

//   private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
//   public isAuthenticated = this.isAuthenticatedSubject.asObservable();

//   constructor(
//     private http: HttpClient,
//     private jwtService: JwtService
//   ) {}

//   populate() {
//     const token = this.jwtService.getToken();
//     if (token) {
//       this.http.get<{user: User}>(`${environment.api_url}/user`).subscribe(
//         (data) => this.setAuth({ ...data.user, token }),
//         () => this.purgeAuth()
//       );
//     } else {
//       this.purgeAuth();
//     }
//   }

//   setAuth(user: User) {
//     console.log('setAuth');
//     console.log(user);

//     this.jwtService.saveToken(user.token);
//     this.currentUserSubject.next(user);
//     this.isAuthenticatedSubject.next(true);
//   }

//   purgeAuth() {
//     console.log('purgeAuth');

//     this.jwtService.destroyToken();
//     this.currentUserSubject.next({} as User);
//     this.isAuthenticatedSubject.next(false);
//   }

//   attemptAuth(type: string, credentials: any): Observable<User> {
//     const route = (type === 'login') ? '/login' : '';
//     return this.http.post<{user: User}>(`${environment.api_url}/users${route}`, { user: credentials })
//       .pipe(map(data => {
//         this.setAuth(data.user);
//         return data.user;
//       }));
//   }

//   getCurrentUser(): User {
//     return this.currentUserSubject.value;
//   }

//   update(user: User): Observable<User> {
//     return this.http.put<{user: User}>(`${environment.api_url}/user`, { user })
//       .pipe(map(data => {
//         this.currentUserSubject.next(data.user);
//         return data.user;
//       }));
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = (type === 'login') ? '/login' : '/register';
    return this.http.post<User>(`/api/users${route}`, { user: credentials });
  }
}
