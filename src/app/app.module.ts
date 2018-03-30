import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ChartsModule} from 'ng2-charts';
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
import {LogsComponent} from './logs/logs.component';
import { NavbarComponent } from './navbar/navbar.component';
import { appRoutes } from './routes';
import {AuthService} from './services/auth.service';
import {ContainerService} from './services/container.service';
import {HttpErrorInterceptService} from './services/http-error-intercept.service';
import {ImageService} from './services/image.service';
import {SrcHandlingService} from './services/src-handling.service';
import {OnAuthRouteActivator} from './shared/onAuthRouteActivator';


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
    LogsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthService,
    ContainerService,
    HttpErrorInterceptService,
    ImageService,
    OnAuthRouteActivator,
    SrcHandlingService,
    Title,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptService,
    },
  ],
})
export class AppModule { }
