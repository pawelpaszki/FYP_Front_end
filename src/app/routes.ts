import {Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {AccountComponent} from './account/account.component';
import {AuthComponent} from './auth/auth.component';
import {ChartComponent} from './chart/chart.component';
import {ContainersComponent} from './containers/containers.component';
import {DockerHubSearchComponent} from './docker-hub-search/docker-hub-search.component';
import {ImagesComponent} from './images/images.component';
import {LogsComponent} from './logs/logs.component';
import {OnAuthRouteActivator} from './shared/onAuthRouteActivator';

export const appRoutes: Routes = [
  { path: 'images', component: ImagesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'containers', component: ContainersComponent, canActivate: [OnAuthRouteActivator] },
  { path: 'search', component: DockerHubSearchComponent, canActivate: [OnAuthRouteActivator] },
  { path: 'logs', component: LogsComponent, canActivate: [OnAuthRouteActivator] },
  { path: 'account', component: AccountComponent, canActivate: [OnAuthRouteActivator] },
  { path: 'login', component: AuthComponent },
  { path: 'chart/:name', component: ChartComponent },
  { path: '**', redirectTo: 'about' },
];
