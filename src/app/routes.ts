import {Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {AccountComponent} from './account/account.component';
import {AuthComponent} from './auth/auth.component';
import {ChartComponent} from './chart/chart.component';
import {ContainersComponent} from './containers/containers.component';
import {DockerHubSearchComponent} from './docker-hub-search/docker-hub-search.component';
import {ImagesComponent} from './images/images.component';

export const appRoutes: Routes = [
  { path: 'images', component: ImagesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'containers', component: ContainersComponent },
  { path: 'search', component: DockerHubSearchComponent },
  { path: 'account', component: AccountComponent },
  { path: 'login', component: AuthComponent },
  { path: 'chart/:name', component: ChartComponent },
  { path: '**', redirectTo: 'about' },
];
