import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormFactory, EncounterAdapter, PersonAttribuAdapter, DataSources, Form } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { EncounterResourceService } from '../services/encounter-resource.service';
import { UserService } from '../services/user.service';
import { PatientService } from '../services/patient-service';
import { PersonResourceService } from '../services/person-resource.service';
import { FormSubmissionService } from './form-submission.service';
import { FormDataSourceService } from './form-data-source.service';
import { Subscription, Observable, Subject, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-formentry',
  templateUrl: './formentry.component.html',
  styleUrls: ['./formentry.component.css']
})
export class FormentryComponent implements OnInit {
  private subscription: Subscription;
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;
  private encounterUuid: string = null;
  private encounter: any = null;
  public encounterLocation: any;
  private visitUuid: string = null;
  public formName: string = '';
  public preserveFormAsDraft: boolean = true;
  public form: Form;
  public formSubmissionErrors: Array<any> = null;
  public formRenderingErrors: Array<any> = [];
  public patient: any = null;
  public submitClicked: boolean = false;
  private failedPayloadTypes: Array<string> = null;
  private compiledSchemaWithEncounter: any = null;
  public submittedOrders: any = {
    encounterUuid: null,
    orders: []
  };
  public submittedEncounter: any;
  constructor(private router: Router, private route: ActivatedRoute,
    private formFactory: FormFactory,
    private encounterResource: EncounterResourceService,
    private encounterAdapter: EncounterAdapter,
    private userService: UserService,
    private formSubmissionService: FormSubmissionService,
    private patientService: PatientService,
    private formDataSourceService: FormDataSourceService,
    private personAttribuAdapter: PersonAttribuAdapter,
    private dataSources: DataSources,
    private personResourceService: PersonResourceService) { }

  ngOnInit() {
    this.wireDataSources();
    let componentRef = this;
    this.route.queryParams.subscribe((params) => {
      componentRef.visitUuid = params['visitUuid'];
      componentRef.encounterUuid = params['encounter'];
      componentRef.loadForm();   // load  form
    });
  }
  public onSubmit(): void {
    setTimeout(() => {
      if (!this.form.valid && this.form.showErrors) {
        document.body.scrollTop = 0;
      }
    }, 100);
    const isSaving = this.formSubmissionService.getSubmitStatus();

    if (!isSaving) {
      this.submitForm();
    }
  }

  public retrySubmittingPayload(): void {
    this.submitForm(this.failedPayloadTypes);
  }
  confirmSaved() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  private submitForm(payloadTypes: Array<string> = ['encounter', 'personAttribute']): void {
    this.form.showErrors = !this.form.valid;
    this.disableSubmitBtn();
    // this.handleFormReferrals();
    if (this.form.valid) {
      this.formSubmissionService.setSubmitStatus(true);
      // clear formSubmissionErrors
      this.formSubmissionErrors = null;
      // reset submitted orders
      this.submittedOrders.encounterUuid = null;
      this.submittedOrders.orders = [];
      // submit form
      this.saveEncounterOrUpdateOnCheckDuplicate(payloadTypes);

    } else {
      // document.getElementById('formentry-submit-btn').setAttribute('disabled', 'true');
      this.form.markInvalidControls(this.form.rootNode);
      this.enableSubmitBtn();
    }

  }

  private saveEncounterOrUpdateOnCheckDuplicate(payloadTypes) {
    console.log('Valid', payloadTypes);
    this.saveEncounterOrUpdate(payloadTypes);
  }

  private saveEncounterOrUpdate(payloadTypes) {
    this.formSubmissionService.submitPayload(this.form, payloadTypes).subscribe(
      (data) => {
        // this.isBusyIndicator(false); // hide busy indicator
        //  this.handleSuccessfulFormSubmission(data);
        console.log('All payloads submitted successfully:', data);
        this.formSubmissionService.setSubmitStatus(false);
        this.enableSubmitBtn();
        this.successSwal.show();
      },
      (err) => {
        this.errorSwal.show();
        console.error('error', err);
        //this.isBusyIndicator(false); // hide busy indicator
        //  this.handleFormSubmissionErrors(err);
        this.enableSubmitBtn();
        this.formSubmissionService.setSubmitStatus(false);
      });
  }


  private checkFormSumittedStatus() {

    let submitStatus = this.submitClicked;
    return submitStatus;

  }

  private resetSubmitStatus() {

    this.submitClicked = false;

  }

  private disableSubmitBtn() {

    let submitBtn = document.getElementById('formentry-submit-btn');
    if (typeof submitBtn === 'undefined' || submitBtn === null) {

    } else {

      document.getElementById('formentry-submit-btn').setAttribute('disabled', 'true');

    }
  }

  private enableSubmitBtn() {

    let submitBtn = document.getElementById('formentry-submit-btn');

    if (typeof submitBtn === 'undefined' || submitBtn === null) {

    } else {

      document.getElementById('formentry-submit-btn').removeAttribute('disabled');

      this.resetSubmitStatus();
    }

  }
  public wireDataSources() {
    this.dataSources.registerDataSource('location',
      this.formDataSourceService.getDataSources()['location']);
    this.dataSources.registerDataSource('provider',
      this.formDataSourceService.getDataSources()['provider']);
    this.dataSources.registerDataSource('drug',
      this.formDataSourceService.getDataSources()['drug']);
    this.dataSources.registerDataSource('problem',
      this.formDataSourceService.getDataSources()['problem']);
    this.dataSources.registerDataSource('personAttribute',
      this.formDataSourceService.getDataSources()['location']);
    this.dataSources.registerDataSource('conceptAnswers',
      this.formDataSourceService.getDataSources()['conceptAnswers']);
  }
  private getcompiledSchemaWithEncounter(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      this.route.data.subscribe(
        (routeData: any) => {
          observer.next(routeData.compiledSchemaWithEncounter);
        },
        (err) => {
          observer.error(err);
        });
    }).first();
  }

  private getPatient(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      this.patientService.getCurrentPatient().subscribe(
        (patient) => {
          if (patient) {
            observer.next(patient);
          }
        },
        (err) => {
          observer.error(err);
        });
    }).first();
  }
  private getEncounters(): Observable<any> {

    return Observable.create((observer: Subject<any>) => {
      if (this.encounterUuid && this.encounterUuid !== '') {
        this.encounterResource.getEncounterByUuid(this.encounterUuid)
          .subscribe((encounter) => {
            encounter.provider = encounter.encounterProviders[0].provider;
            // let wrappedEnconter: Encounter = new Encounter(encounter);
            observer.next(encounter);
          }, (error) => {
            observer.error(error);
          });
      } else {
        observer.next(null);
      }
    }).first();
  }

  private loadForm(): void {
    //this.isBusyIndicator(true, 'Please wait, loading form');
    let observableBatch: Array<Observable<any>> = [];
    // push all subscriptions to this batch eg patient, encounters, formSchema
    observableBatch.push(this.getcompiledSchemaWithEncounter()); // schema data [0]
    observableBatch.push(this.getPatient()); // patient [1]
    observableBatch.push(this.getEncounters()); // encounters [2]

    // forkjoin all requests
    this.subscription = forkJoin(
      observableBatch
    ).pipe(tap((data) => {
      // now init private and public properties
      this.compiledSchemaWithEncounter = data[0] || null;
      this.patient = data[1] || null;
      this.encounter = data[2] || null;
      console.log(this.encounter);
      // now render form
      // return this.patientReminderService.getPatientReminders(this.patient.person.uuid);
    })).subscribe(
      (data: any) => {
        this.renderForm();
        //this.isBusyIndicator(false);
      },
      (err) => {
        console.error(err);
        // this.isBusyIndicator(false);
        // this.formRenderingErrors
        //  .push('An error occured while loading form, please check your connection');
      }
    );
  }
  private renderForm(): void {
    this.formRenderingErrors = []; // clear all rendering errors
    try {
      let schema: any = this.compiledSchemaWithEncounter.schema;
      this.formName = this.compiledSchemaWithEncounter.schema.display;
      let historicalEncounter: any = this.compiledSchemaWithEncounter.encounter;
      this.dataSources.registerDataSource('patient',
        this.formDataSourceService.getPatientObject(this.patient), true);


      // set up visit encounters data source
      // this.setUpVisitEncountersDataObject();

      // for the case of hiv, set-up the hiv summary
      // this.setUpHivSummaryDataObject();

      if (this.encounter) { // editing existing form
        this.form = this.formFactory.createForm(schema, this.dataSources.dataSources);
        this.formRelationsFix(this.form);
        this.encounterAdapter.populateForm(this.form, this.encounter);
        this.personAttribuAdapter.populateForm(this.form, this.patient.person.attributes);
        this.form.valueProcessingInfo.encounterUuid = this.encounterUuid;
      } else { // creating new from
        this.dataSources.registerDataSource('rawPrevEnc', historicalEncounter, false);
        this.form = this.formFactory.createForm(schema, this.dataSources.dataSources);
        this.formRelationsFix(this.form);
        this.form.valueProcessingInfo.patientUuid = this.patient.uuid;
        // add visit uuid if present
        if (this.visitUuid && this.visitUuid !== '') {
          this.form.valueProcessingInfo.visitUuid = this.visitUuid;
        }
        // now set default value
        this.loadDefaultValues();
      }
      // add valueProcessingInfo
      this.form.valueProcessingInfo.personUuid = this.patient.person.uuid;
      this.form.valueProcessingInfo.formUuid = schema.uuid;
      console.log('Providew', this.form);
      // this.setUpWHOCascading();
      if (schema.encounterType) {
        this.form.valueProcessingInfo.encounterTypeUuid = schema.encounterType.uuid;
      } else {
        throw new Error('Please associate the form with an encounter type.');
      }
      // Find and set a provider uuid to be used when updating orders as orderer
      this.setProviderUuid();

    } catch (ex) {
      // TODO Handle all form rendering errors
      console.error('An error occured while rendering form:', ex);
      this.formRenderingErrors.push('An error occured while rendering form: ' + ex.message);
    }

  }

  public loadDefaultValues(): void {
    // let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    let currentUser = this.userService.getLoggedInUser();
    let currentDate = moment().format();

    let encounterDate = this.form.searchNodeByQuestionId('encDate');
    if (encounterDate.length > 0) {
      encounterDate[0].control.setValue(currentDate);
    }
    let encounterLocation = this.form.searchNodeByQuestionId('location', 'encounterLocation');
    // if (encounterLocation.length > 0 && location) {
    //   this.encounterLocation = { value: location.uuid, label: location.display };
    //   encounterLocation[0].control.setValue(location.uuid);
    // }
    //encounterLocation[0].control.setValue('aff27d58-a15c-49a6-9beb-d30dcfc0c66e');


    let encounterProvider = this.form.searchNodeByQuestionId('provider',
      'encounterProvider');

    if (encounterProvider.length > 0 &&
      this.compiledSchemaWithEncounter &&
      this.compiledSchemaWithEncounter.provider !== {}) {
      let cloned = Object.assign({}, this.compiledSchemaWithEncounter);
      console.log('Compilled', cloned);
      // let provider = this.compiledSchemaWithEncounter.provider.uuid;
      // encounterProvider[0].control.setValue('f9badd80-ab76-11e2-9e96-0800200c9a66');
    }
  }


  private setProviderUuid() {
    let request = this.getProviderUuid();
    request.subscribe(
      (data) => {
        let provider = data.providerUuid;
        this.form.valueProcessingInfo.providerUuid = provider;
        let encounterProvider = this.form.searchNodeByQuestionId('provider',
          'encounterProvider');
        if (encounterProvider.length > 0) {
          encounterProvider[0].control.setValue(provider);
        }
      },
      (error) => {
        console.warn('Provider not found. Are you a provider?');
      }
    );

  }

  private getProviderUuid() {
    let encounterProvider = this.form.searchNodeByQuestionId('provider', 'encounterProvider');
    let personUuid = '';
    if (encounterProvider.length > 0) {
      personUuid = encounterProvider[0].control.value;
    }
    return this.formDataSourceService.getProviderByUuid(personUuid);
  }
  /**
   * This is a temporary work around till form relations are build properly
   */
  private formRelationsFix(form: any) {
    let childControls = [
      'difOfCaregiver',
      'missADose',
      'receiveADose',
      'trueOfCaregiver',
      'adherenceAss'
    ];

    let onArtControl = form.searchNodeByQuestionId('onArt');
    let pcpProphylaxisCurrentControl = form.searchNodeByQuestionId('pcpProphylaxisCurrent');
    let onTbProphylaxisControl = form.searchNodeByQuestionId('onTbProphylaxis');

    childControls.forEach((cControl) => {
      let childControl = form.searchNodeByQuestionId(cControl);

      if (onArtControl && onArtControl[0] && childControl[0]) {
        this.updateRelatedControlFix(onArtControl[0], childControl[0]);
      }

      if (pcpProphylaxisCurrentControl && pcpProphylaxisCurrentControl[0] && childControl[1]) {
        this.updateRelatedControlFix(pcpProphylaxisCurrentControl[0], childControl[1]);
      }

      if (onTbProphylaxisControl && onTbProphylaxisControl[0] && childControl[2]) {
        this.updateRelatedControlFix(onTbProphylaxisControl[0], childControl[2]);
      }
    });

    let tbProphyAdherencenotes = form.searchNodeByQuestionId('tbProphyAdherencenotes');
    this.updateRelatedControlFix(onTbProphylaxisControl[0], tbProphyAdherencenotes[0]);
    let tbAdherencenotes = form.searchNodeByQuestionId('tbAdherencenotes');
    this.updateRelatedControlFix(onTbProphylaxisControl[0], tbAdherencenotes[0]);

  }

  private updateRelatedControlFix(parentControl, childControl) {
    if (childControl) {
      childControl.control.controlRelations.addRelatedControls(parentControl.control);
      childControl.control.controlRelations.relations.forEach((relation) => {
        relation.updateControlBasedOnRelation(parentControl);
      });
    }
  }


}
