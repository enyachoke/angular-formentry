import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private loginService: SessionService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.loginService.getSession().pipe(
      map((res:any) => {
        if(res.authenticated){
          this.loginService.saveUser(res.user);
          return true;
        }else{
          this.router.navigate(['/login']);
          return false;
        }
      })
    )
  }
}
