import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ImageService {

  constructor(private http: HttpClient, private toastr: ToastrService) {

  }

  public getImages(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/images', httpOptions)
      .pipe(
        tap(() => {}),
      );
  }

  public removeImage(id: string): Observable<any> {
    const token: string = localStorage.getItem('token');
    const authHttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': token }),
    };
    return this.http.delete<any>('http://localhost:3000/api/images/' + id, authHttpOptions).pipe(
      tap((_) =>
        this.toastr.success('Image removed. id: ' + id, 'Success')),
    );
  }

  public getVulnerabilityCheckRecords(startDate: Date, endDate: Date, imageName: string): Observable<any[]> {
    const name: string = imageName.replace('/', '%2F');
    return this.http.post<any[]>(`http://localhost:3000/api/imageFreshness/${name}`, {startDate, endDate}).pipe(
      tap(() => {}),
    );
  }
}
