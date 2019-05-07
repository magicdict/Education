import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent, IClassInfo, ITeacher, IClassExam, IStudentGroupProperty } from '../Common/Education.model';
import { HomeService } from '../Common/Home.service';
import { SexRatePieOption } from '../GraphOption/StudentGraphOption'
import { ISimpleBar, ToolboxSaveImageOnly } from '../GraphOption/KaoqinOption';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { CommonFunction } from '../Common/common';
import { ClassExamListComponent } from '../Common/ClassExamList/ClassExamList.component';
import { ExamSubNameOption } from '../GraphOption/ScoreOption';

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
  mSexRate = CommonFunction.clone(SexRatePieOption);
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
    //console.log("地图初始化了");
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

  SaveSexRateImage() {
    CommonFunction.SaveChartImage(this.SexRateEchartsInstance, this.ClassName + "性别比例");
  }

  SaveKaoqinImage() {
    CommonFunction.SaveChartImage(this.KaoqinEchartsInstance, this.ClassName + "考勤统计");
  }

  cols = [
    { field: 'id', header: "学号" },
    { field: 'name', header: "姓名" },
    { field: 'sex', header: "性别" },
    { field: 'bornDate', header: "出生年" },
    { field: 'policy', header: "政治面貌" },
    { field: 'nation', header: "民族" },
    { field: 'nativePlace', header: "出生地" },
    { field: 'optionCourse', header: "七选三" }
  ];


  ngOnInit(): void {
    if (this.service.CurrentClassInfo === undefined) {
      return;
    }
    this.route.data
      .subscribe((data: { classinfo: IClassInfo }) => {
        this.QueryResult = this.service.CurrentClassInfo;
        this.StudentCnt = this.QueryResult.length;
        this.ClassName = this.QueryResult[0].className;
        this.ClassId = this.QueryResult[0].classId;
        this.StudentsInfo = data.classinfo.property;

        this.mSexRate.title.text = this.ClassName + "性别比例";
        this.mSexRate.title['show'] = false;
        this.mSexRate.legend['show'] = false;
        this.mSexRate.series[0]['radius'] = '75%';
        this.mSexRate.series[0].data[0].value = data.classinfo.property.totalSexRate.maleCnt;
        this.mSexRate.series[0].data[1].value = data.classinfo.property.totalSexRate.femaleCnt;
        if (this.SexRateEchartsInstance !== undefined) {
          this.SexRateEchartsInstance.setOption(this.mSexRate);
        }
        //console.log(this.mSexRate);
        this.Teachers = data.classinfo.teachers;
        this.Exams = [];
        //classTerm划分
        from(data.classinfo.exams).pipe(
          groupBy(x => x.record.term),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            this.Exams.push(r.filter(x => x.record.subId !== "99" && x.record.subId !== "98"));
          }
        )
        this.Exams.sort((x, y) => {
          return x[0].record.term.localeCompare(y[0].record.term);
        });

        this.subNameOptionsMid = [];
        this.subNameOptionsFinal = [];
        this.subNameOptionsMidFinal = [];
        this.subNameOptionsMidFinalRate = [];
        this.CreateOptionForGrade("期中", this.subNameOptionsMid);
        this.CreateOptionForGrade("期末", this.subNameOptionsFinal);
        this.CreateOptionForGrade("", this.subNameOptionsMidFinal);
        this.CreateRateOptionForGrade(this.subNameOptionsMidFinalRate);

        if (data.classinfo.kaoqing.length === 0) {
          this.IsShowKaoqinGraph = false;
        } else {
          this.IsShowKaoqinGraph = true;
          this.KaoqinOpt = {
            xAxis: {
              type: 'category',
              data: data.classinfo.kaoqing.map(x => x.name)
            },
            title: {
              text: this.ClassName + "考勤统计"
            },
            toolbox: ToolboxSaveImageOnly,
            yAxis: {
              type: 'value'
            },
            series: [{
              data: data.classinfo.kaoqing.map(x => x.value),
              type: 'bar'
            }]
          };
          this.KaoqinOpt.title['show'] = false;
          if (this.KaoqinEchartsInstance !== undefined) {
            try {
              this.KaoqinEchartsInstance.setOption(this.KaoqinOpt);
            } catch (error) {
              //从不显示到显示这里会报错
            }
          }
        }
      });
  }

  subNameList = ['语文', '数学', '英语', '历史', '政治', '生物', '物理', '化学', '地理'];
  subNameOptionsMid: any[] = [];
  subNameOptionsFinal: any[] = [];
  subNameOptionsMidFinal: any[] = [];
  subNameOptionsMidFinalRate: any[] = [];
  CreateRateOptionForGrade(optarray: any[]) {
    this.subNameList.forEach(
      subname => {
        let opt = CommonFunction.clone(ExamSubNameOption);
        opt.title.text = subname + "考试趋势"
        opt.legend.data = ['最高得分率', '最低得分率', '平均得分率']
        opt.series[0].name = '最高得分率';
        opt.series[1].name = '最低得分率';
        opt.series[2].name = '平均得分率';
        let High = [];
        let Low = [];
        let Avg = [];
        let xAxis = [];
        this.Exams.forEach(examlist => {
          if (this.ClassName.indexOf("高二") !== -1) {
            //对于高二的修正

            let rate = 100;
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === "期中");
            if (x !== undefined) {
              High.push(CommonFunction.roundvalue(x.maxScore / rate));
              Low.push(CommonFunction.roundvalue(x.minScore / rate));
              Avg.push(CommonFunction.roundvalue(x.avgScore / rate));
              xAxis.push(x.record.term + "期中")
            }

            if (subname === "语文" || subname === "数学" || subname == "英语") {
              rate = 150;
            }
            let y = examlist.find(x => x.record.subName === subname && x.record.typeName === "期末");
            if (y !== undefined) {
              High.push(CommonFunction.roundvalue(y.maxScore / rate));
              Low.push(CommonFunction.roundvalue(y.minScore / rate));
              Avg.push(CommonFunction.roundvalue(y.avgScore / rate));
              xAxis.push(y.record.term + "期末")
            }
          }
          if (this.ClassName.indexOf("高三") !== -1) {
            //对于高三的修正
            let rate = 100;
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === "期中");
            if (x !== undefined) {
              if (subname === "语文") {
                if (x.record.term == "2018-2019-1") rate = 150;
              }
              High.push(CommonFunction.roundvalue(x.maxScore / rate));
              Low.push(CommonFunction.roundvalue(x.minScore / rate));
              Avg.push(CommonFunction.roundvalue(x.avgScore / rate));
              xAxis.push(x.record.term + "期中")
            }

            let y = examlist.find(x => x.record.subName === subname && x.record.typeName === "期末");
            if (y !== undefined) {
              if (subname === "语文" || subname === "数学" || subname == "英语") {
                if (y.record.term == "2016-2017-1") rate = 150;
                if (y.record.term == "2017-2018-1") rate = 150;
                if (y.record.term == "2017-2018-2") rate = 150;
              }
              High.push(CommonFunction.roundvalue(y.maxScore / rate));
              Low.push(CommonFunction.roundvalue(y.minScore / rate));
              Avg.push(CommonFunction.roundvalue(y.avgScore / rate));
              xAxis.push(y.record.term + "期末")
            }
          }
        });
        opt.series[0].data = High;
        opt.series[1].data = Low;
        opt.series[2].data = Avg;
        opt.xAxis.data = xAxis;
        optarray.push(opt);
      }
    )
  }
  CreateOptionForGrade(typeName: string, optarray: any[]) {
    this.subNameList.forEach(
      subname => {
        let opt = CommonFunction.clone(ExamSubNameOption);
        opt.title.text = subname + typeName + "考试趋势"
        let High = [];
        let Low = [];
        let Avg = [];
        let xAxis = [];
        this.Exams.forEach(examlist => {

          if (typeName === "") {
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === "期中");
            if (x !== undefined) {
              High.push(x.maxScore);
              Low.push(x.minScore);
              Avg.push(x.avgScore);
              xAxis.push(x.record.term + "期中")
            }
            let y = examlist.find(x => x.record.subName === subname && x.record.typeName === "期末");
            if (y !== undefined) {
              High.push(y.maxScore);
              Low.push(y.minScore);
              Avg.push(y.avgScore);
              xAxis.push(y.record.term + "期末")
            }
          } else {
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === typeName);
            if (x !== undefined) {
              High.push(x.maxScore);
              Low.push(x.minScore);
              Avg.push(x.avgScore);
              xAxis.push(x.record.term)
            }
          }
        });
        opt.series[0].data = High;
        opt.series[1].data = Low;
        opt.series[2].data = Avg;
        opt.xAxis.data = xAxis;
        optarray.push(opt);
      }
    )
  }

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }
  JumpToTeacher(teacherid: string) {
    this.router.navigate(['teacher/overview', teacherid]);
  }

  @ViewChild("classExamList")
  classExamList: ClassExamListComponent;

  //Panel里面带滚动条表格的修复
  IsFirst = true;
  handleChange(e) {
    var index = e.index;
    if (index !== 2) return;
    if (this.IsFirst) {
      this.IsFirst = false;
      this.classExamList.ResetScroll();
    }
  }
}
