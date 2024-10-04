import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private tokenKey = 'access_token';

  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? window.localStorage.getItem(this.tokenKey) : null;
  }

  destroyToken() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.tokenKey);
    }
  }
}
