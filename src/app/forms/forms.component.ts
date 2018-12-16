import { Component, OnInit } from '@angular/core';
import { FormsResourceService } from '../services/forms-resource.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  forms = [];
  constructor(private formsResourceService: FormsResourceService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.formsResourceService.getForms().subscribe((forms: any) => {
      this.forms = this.filterUnpublished(forms);
      console.log('Forms', this.forms);
    }, (error) => {
      console.log(error);
    });
  }

  filterUnpublished(forms: []) {
    return forms.filter((f: any) => {
      return f.published
    })
  }
  public formSelected(form) {
    console.log('Form Selected', form);
    if (form) {
      this.router.navigate(['../formentry', form.uuid], { relativeTo: this.route });
    }
  }

}
