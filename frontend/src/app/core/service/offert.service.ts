import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Offert } from '../models/offert.model';
import { environment } from '../../../environments/environment';

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
<<<<<<< HEAD

  // Método para buscar ofertas por nombre
  find_product_name(encodedSearch?: string): Observable<{ offerts: Offert[], count: number }> {
    if (encodedSearch) {
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
  
// Método para filtrar ofertas con múltiples parámetros, ahora con salario
filterOfferts(filters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number }): Observable<{ offerts: Offert[], count: number }> {
  let params = new HttpParams();

  if (filters.category) {
    params = params.append('categorySlug', filters.category);
  }
  if (filters.company) {
    params = params.append('companySlug', filters.company);
  }
  if (filters.salaryMin !== undefined) {
    params = params.append('salaryMin', filters.salaryMin.toString());
  }
  if (filters.salaryMax !== undefined) {
    params = params.append('salaryMax', filters.salaryMax.toString());
  }

  return this.http.get<{ offerts: Offert[], count: number }>(`${URL}/filter`, { params }).pipe(
    catchError(this.handleError<{ offerts: Offert[], count: 0 }>('filterOfferts', { offerts: [], count: 0 }))
  );
}


  // Manejo de errores
  private handleError<T>(operation = 'operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Error en ${operation}: ${error.message}`);
      return of(result as T);
    };
  }
=======
>>>>>>> parent of fb8a6c6 (Merge pull request #13 from 2-DAW-PROJECTS/alfosan)
}
