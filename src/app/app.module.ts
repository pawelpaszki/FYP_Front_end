import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {ToastrModule} from 'ngx-toastr';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {ChartComponent} from './chart/chart.component';
import { ContainersComponent } from './containers/containers.component';
import { DockerHubSearchComponent } from './docker-hub-search/docker-hub-search.component';
import {FreshnessDefinitionComponent} from './images/freshness-definition.component';
import {FreshnessIndicatorComponent} from './images/freshness-indicator.component';
import { ImagesComponent } from './images/images.component';
import { NavbarComponent } from './navbar/navbar.component';
import { appRoutes } from './routes';
import {AuthService} from './services/auth.service';
import {HttpErrorInterceptService} from './services/http-error-intercept.service';
import {ImageService} from './services/image.service';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ImagesComponent,
    ContainersComponent,
    AboutComponent,
    AuthComponent,
    AccountComponent,
    ChartComponent,
    FreshnessDefinitionComponent,
    FreshnessIndicatorComponent,
    DockerHubSearchComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthService,
    HttpErrorInterceptService,
    ImageService,
    Title,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptService,
    },
  ],
})
export class AppModule { }
