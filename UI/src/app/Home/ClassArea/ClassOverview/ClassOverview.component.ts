import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent, IClassInfo, ITeacher, IClassExam, IStudentGroupProperty } from 'src/app/Home/Common/Education.model';
import { HomeService } from '../../Common/Home.service';
import { SexRatePieOption, regionMapOptions } from '../../GraphOption/StudentGraphOption'
import { ISimpleBar } from '../../GraphOption/KaoqinOption';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { CommonFunction } from '../../Common/common';

@Component({
  templateUrl: 'ClassOverview.html',
})
export class ClassOverviewComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public service: HomeService,
    private cd: ChangeDetectorRef) { }

  public QueryResult: IStudent[] = [];
  public StudentCnt: number;
  public ClassName: string;
  public ClassId: string;
  public Teachers: ITeacher[] = [];
  public Exams: IClassExam[][] = [];
  mSexRate = SexRatePieOption;
  NativePlaceRegionOptions = CommonFunction.clone(regionMapOptions);
  KaoqinOpt: ISimpleBar;
  IsShowKaoqinGraph: boolean;

  StudentsInfo: IStudentGroupProperty;

  ngAfterViewInit() {
    //ExpressionChangedAfterItHasBeenCheckedError的对应
    //因为动态加载了Panel
    this.cd.detectChanges();
  }

  NativeEchartsInstance: any;
  onNativePlaceChartInit(event: any) {
    console.log("地图初始化了");
    this.NativeEchartsInstance = event;
  }

  SexRateEchartsInstance: any;
  onSexRateChartInit(event: any) {
    this.SexRateEchartsInstance = event;
  }

  KaoqinEchartsInstance: any;
  onKaoqinChartInit(event: any) {
    this.KaoqinEchartsInstance = event;
  }

  IsMapReady = false;

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { classinfo: IClassInfo }) => {
        this.QueryResult = this.service.CurrentClassInfo;
        this.StudentCnt = this.QueryResult.length;
        this.ClassName = this.QueryResult[0].className;
        this.ClassId = this.QueryResult[0].classId;
        this.StudentsInfo = data.classinfo.property;

        this.mSexRate.title.text = "";
        this.mSexRate.legend.data = [];
        this.mSexRate.series[0].data[0].value = data.classinfo.property.totalSexRate.maleCnt;
        this.mSexRate.series[0].data[1].value = data.classinfo.property.totalSexRate.femaleCnt;
        if (this.SexRateEchartsInstance !== undefined) {
          this.SexRateEchartsInstance.setOption(this.mSexRate);
        }
        this.NativePlaceRegionOptions.visualMap.max = 5;
        this.NativePlaceRegionOptions.series[0].data = data.classinfo.property.nativePlace;
        if (this.NativeEchartsInstance !== undefined) {
          console.log("地图重新绘制了");
          this.NativeEchartsInstance.setOption(this.NativePlaceRegionOptions);
        }

        this.Teachers = data.classinfo.teachers;
        //classTerm划分
        from(data.classinfo.exams).pipe(
          groupBy(x => x.record.term),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            this.Exams.push(r);
          }
        )


        if (data.classinfo.kaoqing.length === 0) {
          this.IsShowKaoqinGraph = false;
        } else {
          this.IsShowKaoqinGraph = true;
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
          if (this.KaoqinEchartsInstance !== undefined) {
            this.KaoqinEchartsInstance.setOption(this.KaoqinOpt);
          }
        }
      });
  }
  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }
  JumpToTeacher(teacherid: string) {
    this.router.navigate(['teacher/overview', teacherid]);
  }
}
