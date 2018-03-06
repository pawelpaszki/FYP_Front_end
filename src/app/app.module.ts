import {HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ContainersComponent } from './containers/containers.component';
import { DockerHubSearchComponent } from './docker-hub-search/docker-hub-search.component';
import { ImagesComponent } from './images/images.component';
import { NavbarComponent } from './navbar/navbar.component';
import { appRoutes } from './routes';
import {AuthService} from './services/auth.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ImagesComponent,
    ContainersComponent,
    AboutComponent,
    AuthComponent,
    AccountComponent,
    DockerHubSearchComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
  ],
  providers: [ AuthService, Title ],
})
export class AppModule { }
