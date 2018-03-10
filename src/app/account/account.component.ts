import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-account',
  styleUrls: ['./account.component.css'],
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {

  public changePasswordForm: FormGroup;
  public oldPassword: FormControl;
  public newPassword: FormControl;
  public newPasswordConfirm: FormControl;
  constructor() { }

  public ngOnInit() {
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

}
