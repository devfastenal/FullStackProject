import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../shared-sources/toast-service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('authForm') form: NgForm;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  user = null;
  sub: Subscription;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    this.sub = this.authService.user.subscribe(user => {
      if (!user) {
        this.user = null;
        this.isLoginMode = true;
        this.error = null;
        if (this.form !== undefined)
          this.form.reset();
      }
      else {
        this.user = user;
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSwitchMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    form.reset();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    if (this.isLoginMode && !this.user) {
      this.authService.login(form.value.email, form.value.password).subscribe(resData => {
        this.error = null;
        this.toastService.customSuccess('Logged In Successfully');
        this.router.navigate(['/branches']);
        this.isLoading = false;
      }, errorResp => {
        if (errorResp.error.status === 401) {
          this.error = 'Incorrect credentials'
          this.toastService.customError(this.error);
        }
        this.isLoading = false;
      });
    }
    else if (!this.isLoginMode && !this.user) {
      if (form.value.password !== form.value.confirmPassword) {
        this.error = 'Passwords did not match';
        this.toastService.customError(this.error);
        this.isLoading = false;
        return;
      }
      this.authService.signup(form.value.email, form.value.password, form.value.firstname, form.value.lastname).subscribe({
        next: resData => {
          this.error = null;
          this.toastService.customSuccess('Sign up was successful! Please Login to proceed');
          this.isLoginMode = true;
          this.isLoading = false;
          form.reset();
        }, error: errorRes => {
          this.error = 'Password must contain one uppercase, one lowercase and one non-alphanumeric';
          if (errorRes.error.DuplicateUserName)
            this.error = errorRes.error.DuplicateUserName;
          if (errorRes.status === 500)
            this.error = 'Internal server error. Please try again later'

          this.toastService.customError(this.error);
          this.isLoading = false;
        }
      });
    }
    else {
      if (form.value.password === form.value.newPassword) {
        this.error = 'Do not enter same password for both the fields. Choose a new password';
        this.toastService.customError(this.error);
        this.isLoading = false;
        return;
      }
      if (form.value.newPassword !== form.value.confirmNewPassword) {
        this.error = 'Please enter same passoword for Confirm New Passoword field';
        this.toastService.customError(this.error);
        this.isLoading = false;
        return;
      }
      this.authService.changePassword(form.value.password, form.value.newPassword).subscribe({
        next: resData => {
          this.error = null;
          this.router.navigate(['/branches']);
          this.toastService.customSuccess('Password Changed Successfully');
          this.isLoading = false;
        }, error: errorRes => {
          this.error = 'Something went wrong. Make sure you entered correct current password. New Password must contain one uppercase, one lowercase and one non-alphanumeric';
          if (errorRes.status === 500)
            this.error = 'Internal server error. Please try again later'

          this.toastService.customError(this.error);
          this.isLoading = false;
        }
      });
    }
  }
}
