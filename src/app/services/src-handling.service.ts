import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class SrcHandlingService {

  constructor(private http: HttpClient, private toastr: ToastrService) {

  }

  public getExtractedDirectories(): Observable<any[]> {
    const token: string = localStorage.getItem('token');
    const authHttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': token }),
    };
    return this.http.get<any[]>('http://localhost:3000/api/misc/availableDirs', authHttpOptions)
      .pipe(
        tap(() => {}),
      );
  }

  public extractSourceCode(imageName: string, containerId: string) {
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token});
    return this.http.post<any[]>('http://localhost:3000/api/containers/extract',
      {imageName, containerId}, {headers}).pipe(
      tap((_) =>
        this.toastr.success('Source code extracted: ' + imageName, 'Success')),
    );
  }

  public checkVulnerableComponents(imageName: string) {
    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-access-token': token});
    const checkOnly: boolean = true;
    return this.http.put<any[]>('http://localhost:3000/api/imagefreshness',
      {imageName, checkOnly}, {headers}).pipe(
      tap((_) =>
        this.toastr.success('Vulnerable components retrieved for: ' + imageName, 'Success')),
    );
  }


}
