import { Injectable } from '@angular/core';
@Injectable()
export class AppsettingService {
    constructor() { }
    getAppManifest() {
        return JSON.parse(localStorage.getItem('angular-formentry-manifest'));
    }
    saveAppManifest(manifest) {
        localStorage.setItem('angular-formentry-manifest', JSON.stringify(manifest));
    }


    getRestBaseUrl() {
        if (this.getAppManifest() === null || this.getAppManifest().activities.openmrs.href === '*') {
            return '/openmrs-standalone/ws/rest/v1/'
        }
        return this.getAppManifest().activities.openmrs.href + '/ws/rest/v1/'
    }
}