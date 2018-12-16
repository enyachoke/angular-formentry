import { Component, OnInit } from '@angular/core';
import { SessionService } from './services/session.service';
import { PatientResourceService } from './services/patient-resource.service';
import { AppsettingService } from './services/app-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-formentry';
  constructor() {

  }

  ngOnInit(): void {
   
  }

  searchPatient() {

  }

}
