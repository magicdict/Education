import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent } from 'src/app/Education.model';
@Component({
  templateUrl: 'StudentQuery.html',
})
export class StudentQueryComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public QueryResult: IStudent[];

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['overview', event.data.id], { relativeTo: this.route });
  }

}
