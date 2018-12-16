import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PatientSearchComponent } from './patient-search.component'
import { LoginModalComponent } from './login-modal.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { VisitsComponent } from './visits/visits.component';
import { EncountersComponent } from './encounters/encounters.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { ConfigResolver } from './resolvers/config-resolver.service';
import { FormsComponent } from './forms/forms.component';
import { FormentryComponent } from './formentry/formentry.component';
import { FormCreationDataResolverService } from './services/form-creation-data-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: '',
    component: AppComponent,
    resolve: {
      manifest: ConfigResolver
    },
    children: [
      {
        path: 'main',
        component: MainDashboardComponent,
        children: [
          { path: '', redirectTo: 'patient-search', pathMatch: 'full' },
          {
            canActivate: [AuthGuardService],
            path: 'patient-search',
            component: PatientSearchComponent
          },
          {
            canActivate: [AuthGuardService],
            path: 'patient-dashboard/:patient_uuid',
            component: PatientDashboardComponent,
            children: [
              { path: '', redirectTo: 'forms', pathMatch: 'full' },
              {
                path: 'visits',
                component: VisitsComponent
              },
              {
                path: 'encounters',
                component: EncountersComponent
              },
              {
                path: 'forms',
                component: FormsComponent
              },
              {
                path: 'formentry/:formUuid',
                component: FormentryComponent,
                resolve: {
                  compiledSchemaWithEncounter: FormCreationDataResolverService
                }
              },
            ]
          },
        ]
      },
      {
        path: 'login',
        component: LoginModalComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
