import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ImageService {

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getImages();
  }

  public getImages(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/images', httpOptions)
      .pipe(
        tap(() =>
          catchError(this.handleError('get images', []))),
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
