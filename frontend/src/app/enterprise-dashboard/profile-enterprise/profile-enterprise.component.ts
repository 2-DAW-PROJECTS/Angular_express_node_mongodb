import { Component, OnInit } from '@angular/core';
import { UserEnterpriseService } from '../../core/service_prisma/userEnterprise.service';
import { UserEnterprise } from '../../core/models_prisma/userEnterprise.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile-enterprise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-enterprise.component.html',
  styleUrl: './profile-enterprise.component.css'
})
export class ProfileEnterpriseComponent implements OnInit {
  userEnterprise: UserEnterprise | null = null;

  constructor(private userEnterpriseService: UserEnterpriseService) {}

  ngOnInit(): void {
    this.userEnterpriseService.getCurrentUserProfile().subscribe({
      next: (user: UserEnterprise | null) => {
        this.userEnterprise = user;

        // if (this.userEnterprise) {
        //   console.log('User enterprise data:', this.userEnterprise);
        // } else {
        //   console.log('User enterprise data is null');
        // }

      },
      error: (error) => {
        console.error('Error fetching user enterprise data:', error);
      }
    });
  }

  editProfile() {
    console.log('Edit profile logic');
  }

  changePassword() {
    console.log('Change password logic');
  }
}


/*
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ProfileEnterpriseComponent } from './profile-enterprise/profile-enterprise.component';



@NgModule({

  declarations: [

    ProfileEnterpriseComponent

  ],

  imports: [

    CommonModule

  ]

})

export class EnterpriseDashboardModule { }
*/