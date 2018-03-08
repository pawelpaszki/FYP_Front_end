import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class OnAuthRouteActivator implements CanActivate {
  constructor(private authService: AuthService) {

  }

  public canActivate(route: ActivatedRouteSnapshot) {
    return localStorage.getItem('token') !== '';
  }
}
