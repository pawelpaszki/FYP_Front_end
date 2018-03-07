import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {

  }

  public loginUser(username: string, password: string): Observable<any> {
    // this.loginAttempted = true;
    const loginInfo = { username, password };
    return this.http.post<any>('http://localhost:3000/api/login',
      loginInfo, httpOptions).pipe(
      tap((data: any) =>
        localStorage.setItem('token', data.token),
        catchError(this.handleError<any>('login user'))),
    );
  }

  public signUpUser(email: string, password: string): Observable<any> {
    const loginInfo = { email, password };
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
    this.router.navigate(['login']);
  }
}
