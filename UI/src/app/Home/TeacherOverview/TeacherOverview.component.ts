import { Component, OnInit } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITeacher, ITeacherInfo, IClassExam } from 'src/app/Home/Common/Education.model';


@Component({
  templateUrl: 'TeacherOverview.html'
})
export class TeacherOverviewComponent implements OnInit {

  constructor(
    private router: Router,
    public service: HomeService,
    private route: ActivatedRoute) {

  }

  CurrentTeachers: ITeacher[];
  Exams: IClassExam[];
  TeacherHistory: { year: string, classname: string[] }[] = []
  TotalClassCnt = 0;
  CurrentClassCnt = 0;

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { teacherinfo: ITeacherInfo }) => {
        this.CurrentTeachers = [];
        this.Exams = data.teacherinfo.classExams;
        data.teacherinfo.records.forEach(
          e => {
            if (e.term === "2018-2019-1") {
              this.CurrentTeachers.push(e);
              this.CurrentClassCnt += 1;
              this.TotalClassCnt += 1;
            }
          }
        )
        this.TeacherHistory = [];
        for (let k in data.teacherinfo.groupByTerm) {
          console.log(Number(k.substring(0, 4)));
          if (k.substring(0, 4)=="2018") continue;  //本学年的不放入
          this.TeacherHistory.push({ year: k.substring(0, 4), classname: data.teacherinfo.groupByTerm[k] });
          this.TotalClassCnt += data.teacherinfo.groupByTerm[k].length;
        }
        //从现在到过去
        this.TeacherHistory.reverse();
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
