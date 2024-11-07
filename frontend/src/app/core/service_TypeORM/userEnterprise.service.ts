import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserEnterprise } from '../models_TypeORM/userEnterprise.model';
import { JwtAdminService } from './jwt_Admin.service';
import { environment_Admin } from '../../../environments_Admin/environment_Admin';

@Injectable({
  providedIn: 'root'
})
export class UserEnterpriseService {
  private baseUrl = `${environment_Admin.api_url}/userEnterprise`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtAdminService
  ) {}

  getUsers(): Observable<UserEnterprise[]> {
    const token = this.jwtService.getToken();
    
    if (!token) {
      console.error('Token no encontrado');
      return throwError('No se encontró el token de autenticación.');
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<UserEnterprise[]>(`${this.baseUrl}/get_all`, { headers }).pipe(
      tap(response => {
        console.log('Usuarios recibidos:', response);
      }),
      catchError(error => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(error);
      })
    );
  }
  
  updateUserStatus(userId: string, isActive: boolean): Observable<UserEnterprise> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put<UserEnterprise>(`${this.baseUrl}/update-status`, { userId, isActive }, { headers }).pipe(
      catchError(error => {
        console.error('Error al actualizar el estado del usuario:', error);
        return throwError(error);
      })
    );
  }

  deleteUser(userId: string): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/delete-user/${userId}`, { headers });
  }
}
