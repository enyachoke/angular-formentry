import {
    Component, OnInit, OnDestroy, DoCheck
    , Output, Input, EventEmitter, ViewChild
} from '@angular/core';
import { PatientResourceService } from './services/patient-resource.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from './services/patient-service';
import { CurrentVisitService } from './visits/current-visit.service';
@Component({
    selector: 'app-patient-dashboard',
    templateUrl: './patient-dashboard.component.html',
    styleUrls: [],
})
export class PatientDashboardComponent implements OnInit, OnDestroy {
    searchString = '';
    navLinks = [
        {
            path: 'forms',
            label: 'Forms'
        },
        {
            path: 'encounters',
            label: 'Encounters'
        },
        {
            path: 'visits',
            label: 'Visits'
        }
    ];
    currentPatient;
    currentVisit;
    patientUuid = '';
    subscription = new Subscription();
    constructor(private patientResourceService: PatientResourceService,
        private route: ActivatedRoute,
        private currentVisitService: CurrentVisitService,
        private patientService: PatientService) {

    }
    ngOnInit(): void {
        this.subscription.add(this.route.params.subscribe(params => {
            this.patientUuid = params['patient_uuid'];
            this.loadPatient();
        }));
        this.currentVisitService.getCurrentVisit().subscribe((visit) => {
            this.currentVisit = visit;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadPatient() {
        this.subscription.add(this.patientResourceService.getPatientByUuid(this.patientUuid).subscribe((patient) => {
            this.currentPatient = patient;
            this.patientService.setCurrentPatient(this.currentPatient);
        }, (error) => {
            console.log('Error', error);
        }));
    }
}