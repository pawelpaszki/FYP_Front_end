import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  public constructor(private titleService: Title ) {
    this.titleService.setTitle( 'Docker vulnerability manager' );
  }
}
