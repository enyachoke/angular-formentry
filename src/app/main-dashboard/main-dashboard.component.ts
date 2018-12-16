import { Component, OnInit } from '@angular/core';
import { AppsettingService } from '../services/app-settings.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  baseUrl = '';
  constructor(private appsettingService: AppsettingService) { }

  ngOnInit() {
    this.baseUrl = this.appsettingService.getAppManifest().activities.openmrs.href;
    if (this.baseUrl === '*') {
      this.baseUrl = './';
    }
  }


}
