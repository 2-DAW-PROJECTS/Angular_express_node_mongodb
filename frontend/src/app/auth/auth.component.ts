import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../app/core/service/user.service';
import { UserEnterpriseService } from '../../app/core/service_prisma/userEnterprise.service';
import { UserAdminService } from '../core/service_TypeORM/userAdmin.service';
import { ListErrorsComponent } from '../shared/list-errors/list-errors.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http';

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
    private userAdminService: UserAdminService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'isEnterprise': [false]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path.toLowerCase();
      this.title = (this.authType === 'login') ? 'Iniciar sesión' : 'Registrarse';

      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl('', Validators.required));
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = { errors: {} };
  
    const credentials = this.authForm.value;
  
    if (this.authType === 'register' && credentials.isEnterprise) {
      this.userEnterpriseService.registerEnterprise(credentials).subscribe({
        next: () => {
          // Redirigir a dashboard de empresa
          this.router.navigateByUrl('/enterprise-dashboard');
        },
        error: (enterpriseErr: HttpErrorResponse) => {
          console.error('Enterprise registration failed:', enterpriseErr);
          this.errors = enterpriseErr;
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      });
    } else if (this.authType === 'register') {
      this.userService.attemptAuth(this.authType, credentials).subscribe({
        next: () => {
          // Redirigir al Dashboard de Usuario
          this.router.navigateByUrl('/user-dashboard');
        },
        error: (userErr: HttpErrorResponse) => {
          console.error('User registration failed:', userErr);
          this.errors = userErr;
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      });
    } else if (this.authType === 'login') {
      // autenticación de Admin
      this.userAdminService.login(this.authType, credentials).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin-dashboard');
        },
        error: (adminErr: HttpErrorResponse) => {
          console.error('Admin login failed:', adminErr);
  
          if (adminErr.status === 401 || adminErr.status === 404) {
            this.userEnterpriseService.login(this.authType, credentials).subscribe({
              next: () => {
                // Dashboard de Enterprise
                this.router.navigateByUrl('/enterprise-dashboard');
              },
              error: (enterpriseErr) => {
                console.error('Enterprise login failed:', enterpriseErr);
  
                // Si tampoco es enterprise, intentar con usuario regular
                if (enterpriseErr.status === 404) {
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
                  // Error en login de Enterprise
                  this.errors = enterpriseErr;
                  this.isSubmitting = false;
                  this.cd.markForCheck();
                }
              }
            });
          } else {
            // Si no es un error 401 o 404, se maneja el error de admin de forma general
            this.errors = adminErr;
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        }
      });
    }
  }
  
  

  logout() {
    if (this.authForm.value.isEnterprise) {
      this.userEnterpriseService.logout();
    } else {
      this.userService.logout();
    }
    this.router.navigateByUrl('/');
  }
}
