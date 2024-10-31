import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments_Enterprise } from '../../../environments_Enterprise/environment_Enterprise';
import { UserEnterpriseService } from './userEnterprise.service';
import { Offert } from '../models_prisma/offertEnterprise.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseUrl = `${environments_Enterprise.api_url}/offertEnterprise`;

  constructor(private http: HttpClient, private userEnterpriseService: UserEnterpriseService) {}
  isAuthenticated(): boolean {
    return this.userEnterpriseService.getCurrentUser() !== null; // Check if current user is not null
  }

  // Obtener todas las ofertas del usuario autenticado
  getOffers(): Observable<Offert[]> {
    const token = this.userEnterpriseService.getAccessToken(); // Método que obtiene el token del usuario
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Offert[]>(`${this.baseUrl}/user_offers`, { headers }); // Cambia any[] a Offert[]
}


  // Crear una nueva oferta
  createOffer(offerData: any): Observable<any> {
    const token = this.userEnterpriseService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<any>(`${this.baseUrl}/create`, offerData, { headers });
  }

  updateOfferStatus(offerId: string, isActive: boolean): Observable<any> {
    const token = this.userEnterpriseService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.patch<any>(`${this.baseUrl}/update_status/${offerId}`, { isActive }, { headers });
  }
  
  getOfferById(offerId: string): Observable<Offert> {
    const token = this.userEnterpriseService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<Offert>(`${this.baseUrl}/${offerId}`, { headers });
  }
  
  updateOffer(offerData: Offert): Observable<any> {
    const token = this.userEnterpriseService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.put<any>(`${this.baseUrl}/update/${offerData.id}`, offerData, { headers });
  }
  
}
