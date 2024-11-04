import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment } from '../models/comments.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/offerts`;

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getAll(offerSlug: string): Observable<Comment[]> {
    return this.http.get<{ comments: Comment[] }>(`${URL}/${offerSlug}/comments`).pipe(
      map(data => data.comments),
      catchError(this.handleError<Comment[]>('getAll', []))
    );
  }

  add(offerSlug: string, payload: string): Observable<Comment> {
    return this.http.post<{ comment: Comment }>(`${URL}/${offerSlug}/comments`, 
        { comment: { body: payload } },
        this.getAuthHeaders()
    ).pipe(
        map(data => data.comment),
        catchError(this.handleError<Comment>('add'))
    );
  }

  delete(commentId: string, offerSlug: string): Observable<any> {
    return this.http.delete(`${URL}/${offerSlug}/comments/${commentId}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError<any>('delete'))
    );
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
