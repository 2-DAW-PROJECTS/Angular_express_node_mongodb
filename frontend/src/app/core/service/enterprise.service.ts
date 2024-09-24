import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise } from '../models/enterprise.model';
import { environment } from '../../../environments/environment';


const URL = `${environment.api_url}/enterprises`;

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  constructor(private http: HttpClient) {}

  findAllEnterprises(params: any): Observable<{enterprises: Enterprise[]}> {
    return this.http.get<{enterprises: Enterprise[]}>(URL, { params });
  }

  findOneEnterprise(slug: string): Observable<{enterprises : Enterprise}> {
    return this.http.get<{enterprises : Enterprise}>(`${URL}/${slug}`);
  }


  // createEnterprise(enterprise: Enterprise): Observable<Enterprise> {
  //   return this.http.post<Enterprise>(this.URL, enterprise);
  // }

  // updateEnterprise(id: string, enterprise: Enterprise): Observable<Enterprise> {
  //   return this.http.put<Enterprise>(`${this.URL}/${id}`, enterprise);
  // }

  // deleteOneEnterprise(id: string): Observable<any> {
  //   return this.http.delete(`${this.URL}/${id}`);
  // }
}
