import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Home.service';
import { ActivatedRoute } from '@angular/router';
import { ITeacher } from 'src/app/Education.model';

@Component({
  templateUrl: 'TeacherOverview.html'
})
export class TeacherOverviewComponent implements OnInit {

  constructor(
    public service: HomeService,
    private route: ActivatedRoute) {

  }

  Current: ITeacher[];
  History: ITeacher[];

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { teacherinfo: ITeacher[] }) => {
        this.Current = [];
        this.History = [];
        data.teacherinfo.forEach(
          e => {
            if (e.term === "2018-2019-1") {
              this.Current.push(e);
            } else {
              this.History.push(e);
            }
          }
        )
      });
  }
}
