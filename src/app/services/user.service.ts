
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from './session.service';

@Injectable()
export class UserService {
    public v: string = 'default';

    constructor(
        protected session: SessionService) { }

    public getLoggedInUser() {
        return this.session.getUser();
    }

}