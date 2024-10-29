import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments_Enterprise } from '../../../environments_Enterprise/environment_Enterprise';
import { UserEnterpriseService } from './userEnterprise.service';

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
  getOffers(): Observable<any[]> {
    const token = this.userEnterpriseService.getAccessToken(); // Método que obtiene el token del usuario
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any[]>(`${this.baseUrl}/user_offers`, { headers });
  }

  // Crear una nueva oferta
  createOffer(offerData: any): Observable<any> {
    const token = this.userEnterpriseService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<any>(`${this.baseUrl}/create`, offerData, { headers });
  }
}
