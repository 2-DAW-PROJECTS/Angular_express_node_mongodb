import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../core/service/user.service';
import { UserEnterpriseService } from '../core/service_prisma/userEnterprise.service';
import { UserAdminService } from '../core/service_TypeORM/userAdmin.service';

@Injectable({
  providedIn: 'root'
})
export class UserTypeGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private userEnterpriseService: UserEnterpriseService,
    private userAdminService: UserAdminService // Importamos el servicio de Admin
  ) {}

  canActivate(): boolean {
    // Verificamos si el usuario es un admin autenticado
    const adminUser = this.userAdminService.getCurrentUser();
    if (adminUser) {
      return true; 
    }
    
    // Si no es admin, verificamos si es usuario de empresa
    const enterpriseUser = this.userEnterpriseService.getCurrentUser();
    if (enterpriseUser) {
      return true;
    }
    
    // Finalmente, si no es admin ni enterprise, verificamos si es usuario normal
    const normalUser = this.userService.getCurrentUser();
    if (normalUser) {
      this.router.navigate(['/']); 
      return false;
    }

    // Si no está autenticado como ninguno, redirige a inicio de sesión
    this.router.navigate(['/login']);
    return false;
  }
}
