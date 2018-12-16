import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from './app-settings.service';

// TODO inject service

@Injectable()
export class PatientResourceService {

  public v: string = 'custom:(uuid,display,' +
    'identifiers:(identifier,uuid,preferred,location:(uuid,name),' +
    'identifierType:(uuid,name,format,formatDescription,validator)),' +
    'person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,' +
    'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
    + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,' +
    'stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5' +
    ',address6)))';

  constructor(protected http: HttpClient,private appsettingService: AppsettingService) {
  }

  public getUrl(): string {

    return this.appsettingService.getRestBaseUrl() + 'patient';
  }

  public searchPatient(searchText: string, cached: boolean = false, v: string = null):
   Observable<any> {

    let url = this.getUrl();
    let params: HttpParams = new HttpParams()
    .set('q', searchText)
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    }).pipe(
      map((response: any) => {
        return response.results;
      }));
  }

  public getPatientByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    let params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      params: params
    });
  }
  public saveUpdatePatientIdentifier(uuid, identifierUuid, payload): Observable<any> {
    if (!payload || !uuid) {
      return null;
    }
    let url = this.getUrl() + '/' + uuid + '/' + 'identifier' + '/' + identifierUuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), {headers}).pipe(
      map((response: any) => {
        return response.patient;
      }));
  }
}

