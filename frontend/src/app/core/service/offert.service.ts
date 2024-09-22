import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Offert } from '../models/offert.model'; // Asegúrate de que la ruta sea correcta
import { Category } from '../models/category.model'; // Importa Category si es necesario

const URL = 'http://localhost:3001/offerts';
const URLcat = 'http://localhost:3001/categories';
const URLfav = 'http://localhost:3001';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    
    constructor(private http: HttpClient) { }

    // GET ALL
    get_products(): Observable<Offert[]> {
        return this.http.get<Offert[]>(URL);
    }

    // // FILTERS
    // get_products_filter(filters: any): Observable<Offert[]> { // Cambia 'Filters' a 'any' o define 'Filters'
    //     return this.http.get<Offert[]>(URL, { params: filters });
    // }
    
    // // GET ONE
    // get_product(slug: string): Observable<Offert> {
    //     return this.http.get<Offert>(`${URL}/${slug}`);
    // }

    // // CREATE
    // create_product(product: Offert): Observable<Offert> { // Cambia el tipo de retorno a 'Offert'
    //     return this.http.post<Offert>(URL, product);
    // }

    // // UPDATE ONE
    // update_product(product: Offert, slug: string): Observable<Offert> { // Cambia el tipo a 'Offert'
    //     return this.http.put<Offert>(`${URL}/${slug}`, product);
    // }

    // // DELETE ONE
    // delete_product(slug: string): Observable<any> { // Cambia el tipo de retorno a 'any'
    //     return this.http.delete<any>(`${URL}/${slug}`);
    // }

    // // DELETE ALL
    // delete_all_products(): Observable<any> { // Cambia el tipo de retorno a 'any'
    //     return this.http.delete<any>(`${URL}`);
    // }

    // getProductsByCategory(slug: string): Observable<Offert[]> {
    //     return this.http.get<Offert[]>(`${URLcat}/${slug}`);
    // }
    
    // // SEARCH
    // find_product_name(search: string): Observable<Offert[]> {
    //     return this.http.get<Offert[]>(`${URL}?name=${search}`).pipe(
    //         map((data) => data) // Puedes simplificar esto
    //     );
    // }

    // favorite(id: string): Observable<any> {
    //     return this.http.post(`${URLfav}/${id}/favorite`, {});
    // }
    
    // unfavorite(id: string): Observable<any> {
    //     return this.http.delete(`${URLfav}/${id}/favorite`);
    // }
}
