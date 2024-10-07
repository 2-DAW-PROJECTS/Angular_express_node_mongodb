import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  // saveToken(token: string) {
  //   if (typeof window !== 'undefined') {
  //     window.localStorage.setItem(this.tokenKey, token);
  //   }
  // }
  saveTokens(accessToken: string, refreshToken: string) {
    // if (typeof window !== 'undefined') {
    // console.log("acces:", accessToken);
    // console.log("refresh:", refreshToken);

      window.localStorage.setItem(this.accessTokenKey, accessToken);
      window.localStorage.setItem(this.refreshTokenKey, refreshToken);
    // }
  }
  getAccessToken(): string | null {
    return window.localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return window.localStorage.getItem(this.refreshTokenKey);
  }

  destroyTokens() {
    window.localStorage.removeItem(this.accessTokenKey);
    window.localStorage.removeItem(this.refreshTokenKey);
  }
  // getToken(): string | null {
  //   return typeof window !== 'undefined' ? window.localStorage.getItem(this.tokenKey) : null;
  // }

  // destroyToken() {
  //   if (typeof window !== 'undefined') {
  //     window.localStorage.removeItem(this.tokenKey);
  //   }
  // }
}
