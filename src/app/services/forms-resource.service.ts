
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppsettingService } from './app-settings.service';

@Injectable()
export class FormsResourceService {
  private forms = new ReplaySubject(1);

  constructor(private http: HttpClient,private appsettingService: AppsettingService) {
  }

  /**
   *
   *
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf AmrsDataService
   */
  public getForms(forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    const params = new HttpParams()
    .set('v', 'custom:(uuid,name,encounterType:(uuid,name),version,' +
      'published,retired,resources:(uuid,name,dataType,valueReference))');

    if (!this.forms.observers.length || forceRefresh) {
      this.http.get<any>(
        this.appsettingService.getRestBaseUrl() + 'form',
        {
          params: params
        }
      ).subscribe(
          (data) => this.forms.next(data.results),
          (error) => this.forms.error(error)
        );
    }

    return this.forms;
  }

  public getFormClobDataByUuid(uuid: string, v: string = null): Observable<any> {

    let url =  this.appsettingService.getRestBaseUrl() + 'clobdata';
    url += '/' + uuid;

    let params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : 'full');

    return this.http.get(url, {
      params: params
    });
  }

  public getFormMetaDataByUuid(uuid: string, v: string = null): Observable<any> {

    let url = this.appsettingService.getRestBaseUrl() + 'form';
    url += '/' + uuid;

    let params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : 'full');

    return this.http.get(url, {
      params: params
    });
  }

}