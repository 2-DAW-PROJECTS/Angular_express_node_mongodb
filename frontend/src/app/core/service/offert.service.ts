import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Offert } from '../models/offert.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';


const URL = `${environment.api_url}/offerts`;

@Injectable({
  providedIn: 'root'
})
export class OffertService {
  constructor(private http: HttpClient) {}

  // Método para obtener todas las ofertas sin filtro
  all_offerts(params: any = {}): Observable<{ offerts: Offert[], count: number }> {
    return this.http.get<{ offerts: Offert[], count: number }>(URL, { params }).pipe(
      catchError(this.handleError<{ offerts: Offert[], count: number }>('all_offerts', { offerts: [], count: 0 }))
    );
  }

  // Método para buscar ofertas por nombre
  find_product_name(encodedSearch?: string): Observable<{ offerts: Offert[], count: number }> {
    if (encodedSearch) {
      // console.log('Encoded search:', encodedSearch);
      const decodedSearch = atob(encodedSearch).trim();
      return this.http.get<{ offerts: Offert[], count: number }>(`${URL}?title=${decodedSearch}`);
    } else {
      return this.all_offerts(); // Carga todas las ofertas si no hay búsqueda
    }
  }
  
  // Método para obtener una oferta por su slug
  get_offert(slug: string): Observable<Offert> {
    return this.http.get<Offert>(`${URL}/${slug}`).pipe(
      catchError(this.handleError<Offert>('get_offert'))
    );
  }
  
  // Método para filtrar ofertas con múltiples parámetros

  filterAndSearchOfferts(filters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number; searchTerm?: string; offset?: number; limit?: number }): Observable<{ offerts: Offert[], count: number }> {
    let params = new HttpParams();

    // console.log(filters);

    Object.keys(filters).forEach(key => {

      // console.log(key, filters[key as keyof typeof filters]);

      if (filters[key as keyof typeof filters] !== undefined && filters[key as keyof typeof filters] !== null) {
        params = params.append(key, filters[key as keyof typeof filters]!.toString());
      }
    });

    // console.log(params);
  
    return this.http.get<{ offerts: Offert[], count: number }>(`${URL}/filter`, { params }).pipe(
      catchError(this.handleError<{ offerts: Offert[], count: number }>('filterAndSearchOfferts', { offerts: [], count: 0 }))
    );
  }
  
  

  // Método para agregar a favoritos
  favoriteOffert(slug: string): Observable<Offert> {
    return this.http.post<Offert>(`${URL}/${slug}/favorite`, {}, this.getAuthHeaders()).pipe(
      catchError(this.handleError<Offert>('favoriteOffert'))
    );
  }

  // Método para quitar de favoritos
  unfavoriteOffert(slug: string): Observable<Offert> {
    return this.http.delete<Offert>(`${URL}/${slug}/favorite`, this.getAuthHeaders()).pipe(
      catchError(this.handleError<Offert>('unfavoriteOffert'))
    );
  }

  // Método para obtener los encabezados de autorización
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
// Método para obtener los favoritos del usuario (ajustado)
getUserFavorites(): Observable<{ offerts: Offert[] }> {
  return this.http.post<{ offerts: Offert[] }>(`${URL}/favorites`, {}, this.getAuthHeaders()).pipe( // Cambiar a POST
      catchError(this.handleError<{ offerts: Offert[] }>('getUserFavorites', { offerts: [] }))
  );
}

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Método para obtener sugerencias de búsqueda
  getSearchSuggestions(term: string, location: string): Observable<any[]> {
    let params = new HttpParams()
      .set('title', term)
      .set('location', location);
  
    return this.http.get<{ offerts: Offert[], count: number }>(`${URL}`, { params }).pipe(
      map(response => response.offerts
        .filter(offert => 
          offert.title.toLowerCase().includes(term.toLowerCase()) &&
          (location === '' || offert.location === location)
        )
        .map(offert => ({
          title: offert.title,
          company: offert.company,
          slug: offert.slug
        }))
      ),
      catchError(this.handleError<any[]>('getSearchSuggestions', []))
    );
  }
  
  
  
  getUniqueLocations(): Observable<string[]> {
    return this.http.get<{ offerts: any[] }>(`${URL}`, { params: { location: '' } })
      .pipe(
        map(response => [...new Set(response.offerts.map(offert => offert.location))] as string[])
      );
  }
  
  getOffertsByLocation(location: string): Observable<{ offerts: Offert[], count: number }> {
    return this.http.get<{ offerts: Offert[], count: number }>(`${URL}`, { params: { location } });
  }

 ///// 
}
