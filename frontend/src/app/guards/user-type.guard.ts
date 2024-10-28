import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../core/service/user.service';
import { UserEnterpriseService } from '../core/service_prisma/userEnterprise.service'; // Importar el servicio de Enterprise

@Injectable({
  providedIn: 'root'
})
export class UserTypeGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService, private userEnterpriseService: UserEnterpriseService) {}

  canActivate(): boolean {
    const currentUser = this.userEnterpriseService.getCurrentUser();

    if (currentUser) {
      return true; 
    } else {
      // Si no hay un usuario de enterprise, verificar el usuario normal
      const normalUser = this.userService.getCurrentUser();
      if (normalUser) {
        this.router.navigate(['/']); 
        return false;
      }
      this.router.navigate(['/']); 
      return false;
    }
  }
}
