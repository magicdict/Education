import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent } from 'src/app/Education.model';
import { HomeService } from '../../Home.service';
@Component({
  templateUrl: 'StudentQuery.html',
})
export class StudentQueryComponent implements OnInit {
  ngOnInit(): void {
    this.QueryResult = this.studentSerice.CurrentClassInfo;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public studentSerice: HomeService
  ) { }

  public QueryResult: IStudent[];

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }

}
