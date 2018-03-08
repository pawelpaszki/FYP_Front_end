import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.css'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  private token: string;
  constructor(private authService: AuthService) {

  }

  public ngOnInit() {
    this.token = localStorage.getItem('token');
  }

  public logout() {
    window.location.reload();
    this.authService.logout();
  }

}
