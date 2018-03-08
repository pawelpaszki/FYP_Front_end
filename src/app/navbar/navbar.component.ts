import { Component, OnInit } from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.css'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  private token: string;
  constructor(private authService: AuthService, private router: Router) {

  }

  public ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.token = localStorage.getItem('token');
      }
    });
  }

  public logout() {
    this.authService.logout();
  }

}
