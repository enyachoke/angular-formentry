import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { VisitResourceService } from '../services/visit-resource.service';
import { Subscription, of, concat, Subject, Observable } from 'rxjs';
import { PatientService } from '../services/patient-service';
import { CurrentVisitService } from './current-visit.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { LocationResourceService } from '../services/location-resource.service';
import * as moment from 'moment';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  visits = [];
  modalRef: BsModalRef;
  myModelId: number;
  model: any = {};
  locations$: Observable<any[]>;
  locationsLoading = false;
  locationsInput$ = new Subject<string>();

  visitTypes: [];

  @ViewChild('template') template
  error = null;
  currentVisitUuid = '';
  currentPatient;
  constructor(private visitResourceService: VisitResourceService,
    private patientService: PatientService,
    private modalService: BsModalService,
    private locationResourceService: LocationResourceService,
    private currentVisitService: CurrentVisitService) { }

  ngOnInit() {
    this.subscription.add(this.patientService.getCurrentPatient().subscribe((patient) => {
      if (patient) {
        this.currentPatient = patient;
        this.loadVisits(patient);
      }
    }));
    this.subscription.add(this.currentVisitService.getCurrentVisit().subscribe((visit => {
      if (visit) {
        this.currentVisitUuid = visit.uuid;
      }

    })));
    this.loadLocations();
    this.loadVisitTypes();
  }

  loadVisits(patient) {
    this.subscription.add(this.visitResourceService
      .getPatientVisits({ patientUuid: patient.uuid }).subscribe((visits) => {
        this.visits = visits;
        this.loadTodayVisit();
      }, (error) => {
        console.log(error);
      }));

  }

  isActiveVisit(visitUuid) {
    return visitUuid === this.currentVisitUuid;
  }
  loadVisit(visit) {
    this.currentVisitService.setCurrentVisit(visit);
  }
  startVisit() {
    setTimeout(() => { this.modalRef = this.modalService.show(this.template); });
  }

  loadTodayVisit() {
    let visit = this.visits.find((v) => {
      return moment().isSame(moment(v.startDatetime), 'day');
    });
    if (visit) {
      this.currentVisitService.setCurrentVisit(visit);
    }
  }
  saveVisit() {
    this.model.patient = this.currentPatient.uuid;
    this.subscription.add(this.visitResourceService.saveVisit(this.model).subscribe((visit) => {
      // this.currentVisitService.setCurrentVisit(visit);
      this.loadVisits(this.currentPatient);
      this.model = {};
      this.modalRef.hide();
    }, (error) => {
      this.model = {};
      console.log('Error', error);
    }));
  }

  private loadLocations() {
    this.locations$ = concat(
      of([]), // default items
      this.locationsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.locationsLoading = true),
        switchMap(term => this.locationResourceService.searchLocation(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => {
            this.locationsLoading = false
          })
        ))
      )
    );
  }

  private loadVisitTypes() {
    this.subscription.add(this.visitResourceService.getVisitTypes({}).subscribe((visitTypes) => {
      this.visitTypes = visitTypes;
    }, (error) => {
      console.log('Error', error);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
