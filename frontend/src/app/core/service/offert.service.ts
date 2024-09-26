import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/*Imports de la App*/
import { Offert } from '../models/offert.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/offerts`; // Corrección en el uso de backticks

@Injectable({
  providedIn: 'root'
})
export class OffertService {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  // Método para obtener todas las ofertas filtradas por categoría
  get_offerts_by_category(slug: string): Observable<{ offerts: Offert[], count: number }> {
    console.log("get_offerts_by_category | offert.service.ts");

    return this.http.get<{ offerts: Offert[], count: number }>(`${URL}/category/${slug}`);
  }

  // find_product_name(encodedSearch: string): Observable<{ products: Offert[], count: number }> {
  //       //
  //       console.log("find_product_name | offert.service.ts");
  //       //
  //   const decodedSearch = atob(atob(encodedSearch));
  //   console.log("decodedSearch:", decodedSearch);
    
  //   return this.http.get<{ products: Offert[], count: number }>(`${URL}?name=${decodedSearch}`);
  // }
  
  find_product_name(encodedSearch?: string): Observable<{ products: Offert[], count: number }> {
    if (encodedSearch) {
      const decodedSearch = atob(encodedSearch);
      console.log("decodedSearch:",decodedSearch);
      console.log("_______________________________");
      console.log(`${URL}?title=${decodedSearch}`);
      return this.http.get<{ products: Offert[], count: number }>(`${URL}?title=${decodedSearch}`);
      // return this.http.get<{ products: Offert[], count: number }>(`${URL}/filter?name=${decodedSearch}`);
    } else {
      return this.http.get<{ products: Offert[], count: number }>(`${URL}`);
    }
  }
  
  



  // Método para obtener todas las ofertas sin filtro
  all_offerts(params: any = {}): Observable<{ offerts: Offert[], count: number }> {
    return this.http.get<{ offerts: Offert[], count: number }>(URL, { params });
  }

  // Método corregido para obtener una oferta por su slug
  get_offert(slug: string): Observable<Offert> {
    return this.http.get<Offert>(`${URL}/${slug}`);  // Aquí aseguramos que la URL base se use correctamente
  }
}