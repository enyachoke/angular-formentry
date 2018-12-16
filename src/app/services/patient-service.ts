import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class PatientService {
    currentPatient = new BehaviorSubject(null);
    setCurrentPatient(patient) {
        this.currentPatient.next(patient);
    }
    getCurrentPatient() {
        return this.currentPatient;
    }
}