import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {IContainerCollection} from '../containers/container-collection.model';
import {IImageModel} from '../images/image.model';

@Injectable()
export class ContainerService {

  public createdContainerInProgress: string[] = [];
  public startedContainerInProgress: string[] = [];
  public stoppedContainerInProgress: string[] = [];
  public removedContainerInProgress: string[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService) {

  }

  public getContainers(): Observable<any[]> {
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token});
    return this.http.get<any[]>('http://localhost:3000/api/containers', {headers}).pipe(
        tap(() => {}),
      );
  }

  public createContainer(imageName: string): Observable<any[]> {
    this.createdContainerInProgress.push(imageName);
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token});
    return this.http.post<any[]>('http://localhost:3000/api/containers/create', {imageName}, {headers}).pipe(
      tap((_) =>
        this.toastr.success('Container created: ' + imageName, 'Success')),
    );
  }

  public startContainer(containerId: string): Observable<any[]> {
    this.startedContainerInProgress.push(containerId);
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token});
    return this.http.post<any[]>('http://localhost:3000/api/containers/start', {containerId}, {headers}).pipe(
      tap((_) =>
        this.toastr.success('Container started: ' + containerId, 'Success')),
    );
  }

  public stopContainer(containerId: string): Observable<any[]> {
    this.stoppedContainerInProgress.push(containerId);
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token});
    return this.http.post<any[]>('http://localhost:3000/api/containers/stop', {containerId}, {headers}).pipe(
      tap((_) =>
        this.toastr.success('Container stopped: ' + containerId, 'Success')),
    );
  }

  public removeContainer(containerId: string): Observable<any> {
    this.removedContainerInProgress.push(containerId);
    const token: string = localStorage.getItem('token');
    const authHttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': token }),
    };
    return this.http.delete<any>('http://localhost:3000/api/containers/' + containerId, authHttpOptions).pipe(
      tap((_) =>
        this.toastr.success('Container removed: ' + containerId, 'Success')),
    );
  }
}
