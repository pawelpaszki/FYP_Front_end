import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ContainerService {

  constructor(private http: HttpClient, private toastr: ToastrService) {

  }

  public getContainers(): Observable<any[]> {
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token, '_id': '123'});
    return this.http.get<any[]>('http://localhost:3000/api/containers', {headers}).pipe(
        tap(() => {}),
      );
  }
  //
  // public removeImage(id: string): Observable<any> {
  //   const token: string = localStorage.getItem('token');
  //   const authHttpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': token }),
  //   };
  //   return this.http.delete<any>('http://localhost:3000/api/images/' + id, authHttpOptions).pipe(
  //     tap((_) =>
  //       this.toastr.success('Image removed. id: ' + id, 'Success')),
  //   );
  // }
}
