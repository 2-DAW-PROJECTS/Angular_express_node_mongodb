import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtEnterpriseService {
  saveToken(token: string) {
    localStorage.setItem('enterprise_access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('enterprise_access_token');
  }

  destroyToken() {
    localStorage.removeItem('enterprise_access_token');
  }
}
