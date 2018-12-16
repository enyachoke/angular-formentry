import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SessionService } from './services/session.service';


@Component({
  templateUrl: './login-modal.component.html'
})
export class LoginModalComponent implements OnInit {
  @ViewChild('template') template

  modalRef: BsModalRef;
  myModelId: number;
  model: any = {};
  error =  null;
  constructor(
    private sessionService: SessionService,
    private modalService: BsModalService,
    private router: Router
  ) {

  }

  ngOnInit() {

    // open modal
    // this.modalRef = this.modalService.show(this.template, { backdrop: 'static', class: 'modal-lg' });
    setTimeout(() => { this.modalRef = this.modalService.show(this.template); });
  }
  login() {
    this.sessionService.getSession(this.model).subscribe((session: any) => {
      if (session.authenticated) {
        this.modalRef.hide();
        this.router.navigate(['patient-search']);
      }else{
        this.error = 'Error logging in check username and password'
      }
    });
  }
}