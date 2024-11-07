import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/service/user.service';
import { UserEnterpriseService } from '../../../core/service_prisma/userEnterprise.service';
import { UserAdminService } from '../../../core/service_TypeORM/userAdmin.service';  // Importa el servicio de Admin
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserEnterprise } from '../../../core/models_prisma/userEnterprise.model';
import { UserAdmin } from '../../../core/models_TypeORM/userAdmin.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  currentUser: User | UserEnterprise | UserAdmin | null = null;  // Ahora incluye el tipo UserAdmin

  constructor(
    private userService: UserService,
    private userEnterpriseService: UserEnterpriseService,
    private userAdminService: UserAdminService,  // Inyecta el servicio de Admin
    private cd: ChangeDetectorRef
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    // Escuchar el estado del usuario Admin
    this.userAdminService.currentUser.subscribe(userAdminData => {
      if (userAdminData) {
        this.currentUser = userAdminData;
      } else {
        // Si no es Admin, escuchar el estado del Enterprise
        this.userEnterpriseService.currentUser.subscribe(userEnterpriseData => {
          if (userEnterpriseData) {
            this.currentUser = userEnterpriseData;
          } else {
            // Si no es Enterprise, escuchar el estado del User
            this.userService.currentUser.subscribe(userData => {
              if (userData) {
                this.currentUser = userData;
              } else {
                this.currentUser = null;
              }
              this.cd.markForCheck();
            });
          }
          this.cd.markForCheck();
        });
      }
      this.cd.markForCheck();
    });
  }

  logout() {
    if (this.currentUser?.usertype === 'admin') {
      this.userAdminService.logout();  // Logout del admin
    } else if (this.currentUser?.usertype === 'user') {
      this.userService.purgeAuth();
    } else if (this.currentUser?.usertype === 'enterprise') {
      this.userEnterpriseService.purgeAuth();
    }
    this.currentUser = null;
  }
}
