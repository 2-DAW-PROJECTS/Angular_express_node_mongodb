import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offert } from '../models/offert.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/offerts`;

@Injectable({
  providedIn: 'root'
})
export class OffertService {
  constructor(private http: HttpClient) {}

  all_offerts(params: any = {}): Observable<{ offerts: Offert[], count: number }> {
    return this.http.get<{ offerts: Offert[], count: number }>(URL, { params });
  }
  
  
}
