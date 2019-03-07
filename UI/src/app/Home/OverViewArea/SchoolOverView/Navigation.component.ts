import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  IStudent,classopt } from '../../../Education.model';
import {  HomeService } from '../../Home.service';


@Component({
  templateUrl: 'Navigation.html',
})
export class NavigationComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public studentSerice: HomeService
  ) { 

  }

  ngOnInit(): void {

  }

  public StudentId: string;
  public ClassId: string;
  public QueryResult: IStudent[];
  public classlist = classopt;

  QueryByStudentId() {
    this.studentSerice.QueryByStudentId(this.StudentId).then(
      r => {
        this.QueryResult = r;
        if (r.length === 1) {
          this.router.navigate(['../student/overview', r[0].id], { relativeTo: this.route });
        }
      }
    )
  }

  QueryByClassId() {
    this.studentSerice.QueryByClassId(this.ClassId).then(
      r => {
        this.QueryResult = r;
        if (r.length !==0){
            this.studentSerice.CurrentClassInfo = r;
            this.router.navigate(['../class/overview',this.ClassId], { relativeTo: this.route });
        }
      }
    )
  }

  JumpTo(url: string) {
      this.router.navigate([url], { relativeTo: this.route });
  }
}
