import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

const URL = `${environment.api_url}/users`;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos PLATFORM_ID para saber si estamos en el navegador
  ) {}

  // Método para obtener los seguidores del usuario actual
  getFollowers(): Observable<User[]> {
    return this.http.get<{ followers: User[] }>(`${URL}/myfollowers`, this.getAuthHeaders()).pipe(
      map(data => data.followers || []), // Asegúrate de que sea un array
      catchError(this.handleError<User[]>('getFollowers', []))
    );
  }
  
  // Método para seguir a un usuario
  followUser(username: string): Observable<any> {
    return this.http.post(`${URL}/${username}/follow`, {}, this.getAuthHeaders()).pipe(
      catchError(this.handleError<any>('followUser'))
    );
  }  

  // Método para dejar de seguir a un usuario
  unfollowUser(username: string): Observable<any> {
    return this.http.delete(`${URL}/${username}/unfollow`, this.getAuthHeaders()).pipe(
      catchError(this.handleError<any>('unfollowUser'))
    );
  }

  // Método para obtener los encabezados de autorización
  private getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      return {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
    }
    return { headers: new HttpHeaders() }; // En el servidor no se utiliza 'Authorization' en los headers
  }

  // Método para obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${URL}/know_users`, this.getAuthHeaders()).pipe(
      map(data => data.users || []), // Accede a la propiedad 'users'
      catchError(this.handleError<User[]>('getAllUsers', []))
    );
  }

  // Método para eliminar a un seguidor
  deleteFollower(followerId: string): Observable<any> {
    return this.http.delete(`${URL}/follower/${followerId}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError<any>('deleteFollower'))
    );
  }

  // Método para manejar errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
