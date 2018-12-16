import {
    Component, OnInit, OnDestroy, DoCheck
    , Output, Input, EventEmitter
} from '@angular/core';
import { PatientResourceService } from './services/patient-resource.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
    selector: 'app-patient-search',
    templateUrl: './patient-search.component.html',
    styleUrls: [],
})
export class PatientSearchComponent implements OnInit, OnDestroy {
    searchString = '';
    page = 1;
    isLoading = false;
    patients = [];
    subscription = new Subscription();
    constructor(private patientResourceService: PatientResourceService, private router: Router) {

    }
    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    searchPatients() {
        this.subscription.add(this.patientResourceService.searchPatient(this.searchString).subscribe((patients) => {
            this.patients = patients;
        }, (error) => {
            console.log('Error', error);
        }));
    }
    onKeydown(event) {
        if (event.key === "Enter") {
            this.searchPatients();
        }
    }
    selectPatient(patient) {
        this.router.navigate(['main','patient-dashboard', patient.uuid]);
    }
}