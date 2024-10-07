import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../app/core/service/user.service';
import { RouterModule } from '@angular/router';
import { ListErrorsComponent } from '../shared/list-errors/list-errors.component'; 

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
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
  }

  // submitForm() {
  //   this.isSubmitting = true;
  //   this.errors = { errors: {} };

  //   const credentials = this.authForm.value;
  //   this.userService.attemptAuth(this.authType, credentials).subscribe(
  //     () => this.router.navigateByUrl('/'),
  //     (err) => {
  //       this.errors = err;
  //       this.isSubmitting = false;
  //       this.cd.markForCheck();
  //     }
  //   );
  // }
  submitForm() {
    this.isSubmitting = true;
    this.errors = { errors: {} };

    const credentials = this.authForm.value;
    this.userService.attemptAuth(this.authType, credentials).subscribe(
      (user) => {
        this.router.navigateByUrl('/');
      },
      (err) => {
        this.errors = err;
        this.isSubmitting = false;
        this.cd.markForCheck();
      }
    );
  }

}
