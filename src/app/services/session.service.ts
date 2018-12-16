import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from './app-settings.service';

// TODO inject service

@Injectable()
export class SessionService {

    constructor(private http: HttpClient,
        private appsettingService: AppsettingService) {
    }

    public getUrl(): string {

        return this.appsettingService.getRestBaseUrl() + 'session';
    }

    public getSession(credentials: any = null) {

        let headers = new HttpHeaders();
        if (credentials && credentials.username) {
            const base64 = btoa(credentials.username + ':' + credentials.password);
            headers = headers.append('Authorization', 'Basic ' + base64);
        }

        let url = this.getUrl();
        return this.http.get(url, { headers: headers });
    }

    public deleteSession() {

        let url = this.getUrl();
        return this.http.delete(url, {});
    }

    public saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    public getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}