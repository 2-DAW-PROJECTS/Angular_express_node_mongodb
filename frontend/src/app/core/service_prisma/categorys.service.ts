import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models_prisma/categorys.model';
import { environments_Enterprise } from '../../../environments_Enterprise/environment_Enterprise';

const URL = `${environments_Enterprise.api_url}/categories`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  // Método para obtener todas las categorías
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(URL);
  }
}
