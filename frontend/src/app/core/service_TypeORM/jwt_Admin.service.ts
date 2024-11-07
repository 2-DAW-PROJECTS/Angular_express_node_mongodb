import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtAdminService {
  private isBrowser: boolean = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  saveToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('admin_access_token', token);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('admin_access_token') : null;
  }

  destroyToken() {
    if (this.isBrowser) {
      localStorage.removeItem('admin_access_token');
    }
  }
}
