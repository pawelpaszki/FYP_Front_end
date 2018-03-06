import { HttpErrorResponse, HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class HttpErrorInterceptService implements HttpInterceptor {

  constructor(private toastr: ToastrService) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(req);
    return next.handle(req)
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          // console.log('ev in the do: ', ev);
        }
      })
      .catch((response: any) => {
        if (response instanceof HttpErrorResponse) {
          if (response.error.error !== null) {
            // console.log(response.url.toString());
            if (response.url.toString().includes('login') || response.url.toString().includes('register')) {
              this.toastr.error(response.error.error, 'Error');
            } else {
              this.toastr.warning(response.error.error, 'Error');
            }
          } else {
            this.toastr.error('', 'Error occured');
          }
        }
        return Observable.throw(response);
      });
  }
}
