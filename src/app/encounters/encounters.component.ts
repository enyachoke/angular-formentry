import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../services/patient-service';
import { EncounterResourceService } from '../services/encounter-resource.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.css']
})
export class EncountersComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  encounters = [];
  constructor(private encounterResourceService: EncounterResourceService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription.add(this.patientService.getCurrentPatient().subscribe((patient) => {
      if (patient) {
        this.loadEncounters(patient);
      }
    }));
  }

  editEncounter(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }

  loadEncounters(patient) {
    this.subscription.add(this.encounterResourceService.getEncountersByPatientUuid(patient.uuid).subscribe((encounters) => {
      this.encounters = encounters;
      console.log('Encounters', encounters);
    }, (error) => {
      console.log('Error', error);
    }))
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
