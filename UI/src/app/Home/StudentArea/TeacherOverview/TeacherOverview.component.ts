import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITeacher } from 'src/app/Education.model';
import { TimelineEvent } from 'ngx-timeline';

@Component({
  templateUrl: 'TeacherOverview.html'
})
export class TeacherOverviewComponent implements OnInit {

  constructor(
    private router: Router,
    public service: HomeService,
    private route: ActivatedRoute) {

  }

  Current: ITeacher[];
  History: ITeacher[];

  events: Array<TimelineEvent>;

  ngOnInit(): void {

    this.events = new Array<TimelineEvent>();
    this.route.data
      .subscribe((data: { teacherinfo: ITeacher[] }) => {
        this.Current = [];
        this.History = [];
        this.events = [];
        data.teacherinfo.forEach(
          e => {
            if (e.term === "2018-2019-1") {
              this.Current.push(e);
            } else {
              this.History.push(e);
            }

            this.events.push({
              "date": new Date(),
              "header": e.term,
              "body": e.className,
              "icon": "fa-search"
            });
          }
        )
      });
  }

  JumpToClass(ClassId: string) {
    this.service.QueryByClassId(ClassId).then(
      r => {
        if (r.length !== 0) {
          this.service.CurrentClassInfo = r;
          this.router.navigate(['class/overview', ClassId]);
        }
      }
    )
  }

}
