import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppsettingService } from '../services/app-settings.service';

@Injectable()
export class ConfigResolver implements Resolve<any> {

  constructor(private http: HttpClient, private appsettingService:AppsettingService) { }

  resolve(): Observable<any> {
    let manifestUrl = './manifest.webapp';
    return this.http.get(manifestUrl,{responseType: 'json'}).pipe(
      tap( (config) => {
            this.appsettingService.saveAppManifest(config);
        } ),
      catchError( (err) => Observable.throw(err.json().error) )
    )
  }
}