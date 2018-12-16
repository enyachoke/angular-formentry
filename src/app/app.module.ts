import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { SessionInterceptor } from './services/session.interceptor';
import { PatientResourceService } from './services/patient-resource.service';
import { LoginModalComponent } from './login-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientSearchComponent } from './patient-search.component';
import { IdentifiersPipe } from './identifiers.pipe';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { VisitsComponent } from './visits/visits.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EncountersComponent } from './encounters/encounters.component';
import { PatientService } from './services/patient-service';
import { VisitResourceService } from './services/visit-resource.service';
import { EncounterResourceService } from './services/encounter-resource.service';
import { CurrentVisitService } from './visits/current-visit.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faEdit , faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocationResourceService } from './services/location-resource.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { FormsComponent } from './forms/forms.component';
import { FormsResourceService } from './services/forms-resource.service';
import { AppsettingService } from './services/app-settings.service';
import { ConfigResolver } from './resolvers/config-resolver.service';
import { FormentryComponent } from './formentry/formentry.component';
import { FormCreationDataResolverService } from './services/form-creation-data-resolver.service';
import { PatientPreviousEncounterService } from './services/patient-previous-encounter.service';
import { FormSchemaService } from './services/form-schema.service';
import { LocalStorageService } from './services/local-storage.service';
import { FormEntryModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { ProviderResourceService } from './services/provider-resource.service';
import { PersonResourceService } from './services/person-resource.service';
import { UserService } from './services/user.service';
import { FormSubmissionService } from './formentry/form-submission.service';
import { FormDataSourceService } from './formentry/form-data-source.service';
import { ConceptResourceService } from './services/concept-resource.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ProvidersPipe } from './providers.pipe';


@NgModule({
  declarations: [
    AppComponent, LoginModalComponent, PatientSearchComponent, IdentifiersPipe, PatientDashboardComponent,
    VisitsComponent, EncountersComponent, MainDashboardComponent, FormsComponent, FormentryComponent, ProvidersPipe
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FontAwesomeModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormEntryModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    })
  ],
  providers: [SessionService,
    PatientResourceService,
    ProviderResourceService,
    PersonResourceService,
    UserService,
    PatientService,
    VisitResourceService,
    EncounterResourceService,
    CurrentVisitService,
    LocationResourceService,
    ConceptResourceService,
    FormsResourceService,
    FormSubmissionService,
    FormDataSourceService,
    AuthGuardService,
    AppsettingService,
    ConfigResolver,
    FormCreationDataResolverService,
    PatientPreviousEncounterService,
    FormSchemaService,
    LocalStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faCoffee);
    library.add(faEdit);
    library.add(faPlus);
  }
}
