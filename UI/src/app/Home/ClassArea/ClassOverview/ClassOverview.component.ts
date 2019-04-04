import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent, IClassInfo, ITeacher, IClassExam } from 'src/app/Home/Common/Education.model';
import { HomeService } from '../../Common/Home.service';
import { SexRatePieOption, regionMapOptions } from '../../GraphOption/StudentGraphOption'
import { ISimpleBar } from '../../GraphOption/KaoqinOption';

@Component({
  templateUrl: 'ClassOverview.html',
})
export class ClassOverviewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public service: HomeService) { }

  public QueryResult: IStudent[] = [];
  public StudentCnt: number;
  public ClassName: string;
  public ClassId: string;
  public Teachers: ITeacher[] = [];
  public Exams: IClassExam[];
  mSexRate = SexRatePieOption;
  NativePlaceRegionOptions = regionMapOptions;
  KaoqinOpt: ISimpleBar;
  IsShowKaoqinGraph: boolean;

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { classinfo: IClassInfo }) => {
        this.QueryResult = this.service.CurrentClassInfo;
        this.StudentCnt = this.QueryResult.length;
        this.ClassName = this.QueryResult[0].className;
        this.ClassId = this.QueryResult[0].classId;
        this.mSexRate.title.text = "";
        this.mSexRate.series[0].data[0].value = data.classinfo.maleCnt;
        this.mSexRate.series[0].data[1].value = data.classinfo.femaleCnt;
        this.NativePlaceRegionOptions.visualMap.max = 25;
        this.NativePlaceRegionOptions.series[0].data = data.classinfo.geoOptions;
        this.Teachers = data.classinfo.teachers;
        this.Exams = data.classinfo.exams;
        if (data.classinfo.kaoqing.length === 0) {
          this.IsShowKaoqinGraph = false;
        } else {
          this.IsShowKaoqinGraph = true;
        }
        this.KaoqinOpt = {
          xAxis: {
            type: 'category',
            data: data.classinfo.kaoqing.map(x => x.name)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: data.classinfo.kaoqing.map(x => x.value),
            type: 'bar'
          }]
        };
      });
  }
  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }
  JumpToTeacher(teacherid: string) {
    this.router.navigate(['teacher/overview', teacherid]);
  }
  JumpToExam() {
    this.router.navigate(['class/exam', this.ClassId]);
  }

}
