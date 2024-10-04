import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string | null {
    return typeof window !== 'undefined' ? window.localStorage.getItem('jwtToken') : null;
  }

  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('jwtToken', token);
    }
  }

  destroyToken() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('jwtToken');
    }
  }
}
