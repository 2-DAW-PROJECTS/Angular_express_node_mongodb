import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserService } from '../../app/core/service/user.service';
import { UserEnterpriseService } from '../../app/core/service_prisma/userEnterprise.service';
import { ListErrorsComponent } from '../shared/list-errors/list-errors.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ListErrorsComponent], 
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
  authType: string = '';
  title: string = '';
  errors: any = { errors: {} };
  isSubmitting = false;
  authForm: FormGroup;
  isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private userEnterpriseService: UserEnterpriseService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';

      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl('', Validators.required));
      }
      this.cd.markForCheck();
    });

    this.userEnterpriseService.isAuthenticated.subscribe(auth => {
      this.isAuthenticated = auth;
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = { errors: {} };
  
    const credentials = this.authForm.value;
  
    this.userEnterpriseService.login(this.authType, credentials).subscribe({
      next: () => {
        this.router.navigateByUrl('/enterprise-dashboard');
      },
      error: (err) => {
        console.error('Enterprise login failed:', err); 
        if (err.status === 404) { 
          this.userService.attemptAuth(this.authType, credentials).subscribe({
            next: () => {
              this.router.navigateByUrl('/user-dashboard');
            },
            error: (userErr) => {
              console.error('User login failed:', userErr);
              this.errors = userErr;
              this.isSubmitting = false;
              this.cd.markForCheck();
            }
          });
        } else {
          this.errors = err;
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      }
    });
  }
  

  logout() {
    this.userEnterpriseService.logout();
    this.router.navigateByUrl('/');
  }
}
