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


  ngOnInit(): void {
    this.route.data
      .subscribe((data: { teacherinfo: ITeacher }) => {
        console.log(data.teacherinfo);
      });
  }
}
