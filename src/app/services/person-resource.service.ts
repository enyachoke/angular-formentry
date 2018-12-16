
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from './app-settings.service';

@Injectable()

export class PersonResourceService {
  public v: string = 'full';
  constructor(protected http: HttpClient, private appsettingService: AppsettingService) {
  }
  public getUrl(): string {

    return  this.appsettingService.getRestBaseUrl() + 'person';
  }

  public getPersonByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    let params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    });
  }

  public saveUpdatePerson(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    let url = this.getUrl() + '/' + uuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), {headers}).pipe(
      map((response: any) => {
        return response.person;
      }));
  }
}