import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CurrentVisitService {
    currentVisit = new BehaviorSubject(null);
    setCurrentVisit(visit) {
        this.currentVisit.next(visit);
    }
    getCurrentVisit() {
        return this.currentVisit;
    }
}