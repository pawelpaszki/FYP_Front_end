import { HttpErrorResponse, HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import {ContainerService} from './container.service';
import {ImageService} from './image.service';
import {SrcHandlingService} from './src-handling.service';


@Injectable()
export class HttpErrorInterceptService implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService, private imageService: ImageService,
              private srcHandlingService: SrcHandlingService, private containerService: ContainerService) { }

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
                this.clearAllInProgress();
                localStorage.setItem('token', '');
                localStorage.setItem('username', '');
              } else if (response.error.error === 'Image cannot be removed') {
                this.imageService.imageRemovalInProgress = [];
                this.toastr.warning('Unable to remove this image. It is used by some other image(s)', 'Warning');
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

  private clearAllInProgress() {
    this.imageService.imageRemovalInProgress = [];
    this.imageService.pulledImageInProgress = [];
    this.srcHandlingService.extractedSrcContainers = [];
    this.srcHandlingService.queriedContainers = [];
    this.srcHandlingService.vulnCompsChecked = [];
    this.srcHandlingService.testsRun = [];
    this.srcHandlingService.osChecked = [];
    this.srcHandlingService.packagesChecked = [];
    this.containerService.createdContainerInProgress = [];
    this.containerService.startedContainerInProgress = [];
    this.containerService.stoppedContainerInProgress = [];
    this.containerService.removedContainerInProgress = [];
  }
}
