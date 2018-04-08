import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {

  public authForm: FormGroup;
  public username: FormControl;
  public password: FormControl;
  public invalidCredentials: boolean = false;
  private authAttempted: boolean;


  constructor(public authService: AuthService, private router: Router) {
  }

  public ngOnInit() {
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.username = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.authForm = new FormGroup({
      password: this.password,
      username: this.username,
    });
  }

  public authenticate(formValues) {
    this.authAttempted = true;
    if (this.username.valid && this.password.valid) {
        this.authService.loginUser(formValues.username, formValues.password).subscribe(() => {
            this.router.navigate(['images']);
            localStorage.setItem('username', formValues.username);
          },
          () => {
            this.invalidCredentials = true;
          });
      }
  }

  public invalidUsername() {
    return (!this.username.valid && !this.username.untouched) ||
      (this.authAttempted === true && this.username.value === '');
  }

  public invalidPassword() {
    return (!this.password.valid && !this.password.untouched) ||
      (this.authAttempted === true && this.password.value === '');
  }
}
