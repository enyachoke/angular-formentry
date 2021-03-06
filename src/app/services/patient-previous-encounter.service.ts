
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import  *  as _  from 'lodash';
import { EncounterResourceService } from './encounter-resource.service';
import { PatientService } from './patient-service';

@Injectable()
export class PatientPreviousEncounterService {

  constructor(private patientService: PatientService,
              private encounterResource: EncounterResourceService) {
  }

  public getPreviousEncounter(encounterType: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.patientService.getCurrentPatient().pipe(take(1)).subscribe(
        (patient) => {
          if (patient) {
            let search = _.find(patient.encounters, (e) => {
              return e.encounterType.uuid === encounterType;
            });

            if (search) {
              this.encounterResource.getEncounterByUuid(search.uuid).pipe(take(1)).subscribe((_encounter) => {
                resolve(_encounter);
              }, (err) => {
                reject(err);
              });
            } else {
              resolve({});
            }
          }
        }, (error) => {
          console.error('Previous encounter error', error);
        });

    });
  }
}