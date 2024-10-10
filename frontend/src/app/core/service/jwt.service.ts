import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getAccessToken(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem(this.accessTokenKey);
      return token;
    }
    return null;
  }
  

  getRefreshToken(): string | null {
    if (this.isBrowser) {
        return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  saveTokens(accessToken: string, refreshToken: string) {
      if (this.isBrowser) {
        // console.log("accessing token", accessToken);
        // console.log("refresh token", refreshToken);
          localStorage.setItem(this.accessTokenKey, accessToken);
          localStorage.setItem(this.refreshTokenKey, refreshToken);
      }
  }


  destroyTokens() {
    if (this.isBrowser) {
      // console.log("Destroying tokens");  // Debug
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      // console.clear();
    }
  }
}
