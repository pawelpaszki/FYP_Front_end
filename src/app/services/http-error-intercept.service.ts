import { HttpErrorResponse, HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class HttpErrorInterceptService implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          // console.log('ev in the do: ', ev);
        }
      })
      .catch((response: any) => {
        if (response instanceof HttpErrorResponse) {
          if (response.error.error !== null) {
            if (response.url.toString().includes('login') ||
              response.url.toString().includes('register')) {
              this.toastr.error(response.error.error, 'Error');
            } else {
              if (response.error.error === 'No token provided.' ||
                response.error.error === 'Unable to authenticate token.') {
                this.toastr.error('Unauthorized to perform this operation. Please sign in', 'Error');
                this.router.navigate(['login']);
                localStorage.setItem('token', '');
                localStorage.setItem('username', '');
              } else {
                this.toastr.warning(response.error.error, 'Error');
              }
            }
          } else {
            this.toastr.error('', 'Error occured');
          }
        }
        return Observable.throw(response);
      });
  }
}
