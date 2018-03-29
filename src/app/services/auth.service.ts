import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class AuthService {

  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }

  public loginUser(username: string, password: string): Observable<any> {
    const loginInfo = { username, password };
    return this.http.post<any>('http://localhost:3000/api/login',
      loginInfo, httpOptions).pipe(
      tap((data: any) =>
        localStorage.setItem('token', data.token),
        catchError(this.handleError<any>('login user'))),
    );
  }

  public changePassword(password: string, newPassword): Observable<any> {
    const token: string = localStorage.getItem('token');
    const username: string = localStorage.getItem('username');
    const headers = new HttpHeaders({ 'x-access-token': token});
    return this.http.put<any[]>('http://localhost:3000/api/update', {username, password, newPassword}, {headers}).pipe(
      tap((data: any) => {
        this.toastr.success('password changed successfully', 'Success');
        localStorage.setItem('token', data.token);
      }),
    );
  }

  public signUpUser(username: string, password: string): Observable<any> {
    const loginInfo = { username, password };
    return this.http.post<any>('http://localhost:3000/api/register', loginInfo, httpOptions).pipe(
        tap((data: any) =>
          localStorage.setItem('token', data.token),
          catchError(this.handleError<any>('sign up user'))),
      );
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  public logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('username', '');
    this.router.navigate(['login']);
  }
}
