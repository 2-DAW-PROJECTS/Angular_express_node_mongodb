import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OffertService } from './offert.service';
import { Offert } from '../models/offert.model';

@Injectable({
    providedIn: 'root'
  })
  export class DetailsResolver implements Resolve<Offert | null> {
    constructor(private offertService: OffertService, private router: Router) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<Offert | null> {
      const slug = route.params['slug'];
      return this.offertService.get_offert(slug).pipe(
        catchError((err) => {
          console.error(`Error fetching offer with slug ${slug}:`, err);
          this.router.navigate(['/']);
          return of(null);
        })
      );
    }
  }
  
