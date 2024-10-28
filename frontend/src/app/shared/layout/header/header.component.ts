import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/service/user.service';
import { UserEnterpriseService } from '../../../core/service_prisma/userEnterprise.service';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserEnterprise } from '../../../core/models_prisma/userEnterprise.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  currentUser: User | UserEnterprise | null = null;

  constructor(
    private userService: UserService,
    private userEnterpriseService: UserEnterpriseService,
    private cd: ChangeDetectorRef
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    this.userEnterpriseService.currentUser.subscribe(userEnterpriseData => {
      if (userEnterpriseData) {
        this.currentUser = userEnterpriseData;
      } else {
        this.userService.currentUser.subscribe(userData => {
          if (userData) {
            this.currentUser = userData;
          }
          this.cd.markForCheck();
        });
      }
      this.cd.markForCheck();
    });
  }

  logout() {
    if (this.currentUser?.usertype === 'user') {
      this.userService.purgeAuth();
    } else if (this.currentUser?.usertype === 'enterprise') {
      this.userEnterpriseService.purgeAuth();
    }
    this.currentUser = null;
  }
}
