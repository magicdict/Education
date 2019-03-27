import { Component, OnInit } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITeacher, ITeacherInfo, IClassExam } from 'src/app/Home/Common/Education.model';
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
  Exams: IClassExam[];
  events: Array<TimelineEvent>;

  ngOnInit(): void {

    this.events = new Array<TimelineEvent>();
    this.route.data
      .subscribe((data: { teacherinfo: ITeacherInfo }) => {
        this.Current = [];
        this.events = [];
        this.Exams = data.teacherinfo.classExams;
        data.teacherinfo.records.forEach(
          e => {
            if (e.term === "2018-2019-1") {
              this.Current.push(e);
            }
          }
        )
        for (let k in data.teacherinfo.groupByTerm) {
          var d = new Date();
          console.log(Number(k.substring(0, 4)));
          d.setFullYear(Number(k.substring(0, 4)), 8, 1);
          this.events.push({
            "date": d,
            "header": k,
            "body": data.teacherinfo.groupByTerm[k].join(","),
            "icon": "fas fa-graduation-cap"
          });
        }
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
