import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { take, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.isAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);
        } else {
          return this.userService.refreshToken().pipe(
            switchMap(() => of(true)),
            catchError(() => {
              this.router.navigate(['/login']);
              return of(false);
            })
          );
        }
      })
    );
  }
}
