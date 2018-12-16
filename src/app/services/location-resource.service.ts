
import { take } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppsettingService } from './app-settings.service';
@Injectable()
export class LocationResourceService {
  private locations = new ReplaySubject(1);
  private v: string = 'full';

  constructor(protected http: HttpClient, private appsettingService: AppsettingService) {
  }

  public getLocationByUuid(uuid: string, cached: boolean = false, v: string = null):
    Observable<any> {

    let url = this.appsettingService.getRestBaseUrl() + 'location';
    url += '/' + uuid;

    let params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);
    let request = this.http.get(url, { params: params });
    return request;
  }



  public searchLocation(searchText: string, v: string = null):
    Observable<any> {

    let url = this.appsettingService.getRestBaseUrl() + 'location';
    let params: HttpParams = new HttpParams()
      .set('q', searchText)
      .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get<any>(url, {
      params: params
    }).pipe(
      map((response) => {
        return response.results;
      }));
  }

}