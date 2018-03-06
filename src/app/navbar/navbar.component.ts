import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.css'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) {

  }

  public ngOnInit() {
  }

  public logout() {
    this.authService.logout();
  }

}
