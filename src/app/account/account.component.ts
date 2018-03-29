import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {

  public changePasswordForm: FormGroup;
  public oldPassword: FormControl;
  public newPassword: FormControl;
  public newPasswordConfirm: FormControl;
  constructor(public authService: AuthService) { }

  public ngOnInit() {
    this.initForm();
  }

  public initForm() {
    this.oldPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.newPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.newPasswordConfirm = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.changePasswordForm = new FormGroup({
      newPassword: this.newPassword,
      newPasswordConfirm: this.newPasswordConfirm,
      oldPassword: this.oldPassword,
    });
  }

  public invalidOldPassword() {
    return (!this.oldPassword.valid && !this.oldPassword.untouched);
  }

  public invalidNewPassword() {
    return (!this.newPassword.valid && !this.newPassword.untouched);
  }

  public invalidNewPasswordConfirm() {
    return (!this.newPasswordConfirm.valid && !this.newPasswordConfirm.untouched);
  }

  public changePassword(formValues) {
    this.authService.changePassword(formValues.oldPassword, formValues.newPassword).subscribe(() => {
      this.initForm();
    });
  }

  public anyInputEmpty() {
    return this.oldPassword.value === '' || this.newPassword.value === '' ||
      this.newPasswordConfirm.value === '';
  }

}
