
import {take} from 'rxjs/operators';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppsettingService } from './app-settings.service';

@Injectable()
export class ConceptResourceService {

  public v: string = 'custom:(uuid,name,conceptClass,answers)';

  constructor(protected http: HttpClient, private appsettingService: AppsettingService) {
  }

  public getUrl(): string {

    return this.appsettingService.getRestBaseUrl() + 'concept';
  }

  public searchConcept(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
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

  public getConceptByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;
    let params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    });
  }
  public getConceptByConceptClassesUuid(searchText, conceptClassesUuidArray) {
    let filteredConceptResults = [];
    let response = this.searchConcept(searchText);
    response.pipe(take(1)).subscribe(
      (concepts) => {
        filteredConceptResults =
          this.filterResultsByConceptClassesUuid(concepts, conceptClassesUuidArray);
      },
      (error) => {

      }
    );
    return filteredConceptResults;
  }
  public filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
    let res = _.filter(results, (result: any) => {
      return _.find(conceptClassesUuidArray, (uuid) => {
        return result.conceptClass.uuid === uuid;
      });
    });
    return res;
  }
}