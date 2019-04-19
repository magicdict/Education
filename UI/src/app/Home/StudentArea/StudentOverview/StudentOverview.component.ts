import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IStudent, IStudentInfo, ITeacher } from '../../Common/Education.model';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { from } from 'rxjs';
import { CommonFunction } from 'src/app/Home/Common/common';
import { ScoreRadarGraphOption } from '../../GraphOption/ScoreOption'
import { CompumptionBarGraph, KaoqinBarGraph } from '../../GraphOption/StudentGraphOption';

@Component({
  templateUrl: 'StudentOverview.html'
})
export class StudentOverviewComponent implements OnInit {

  constructor(
    public service: HomeService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  CompumptionGraph = CompumptionBarGraph;
  KaoqinGraph = KaoqinBarGraph;
  ScoreGraph = ScoreRadarGraphOption;

  CompumptionEchartsInstance: any;
  onCompumptionChartInit(event: any) {
    this.CompumptionEchartsInstance = event;
  }

  ScoreEchartsInstance: any;
  onScoreChartInit(event: any) {
    this.ScoreEchartsInstance = event;
  }

  KaoqinEchartsInstance: any;
  onKaoqinChartInit(event: any) {
    this.KaoqinEchartsInstance = event;
  }

  public IsHeaderReady = false;
  public CurrentStudent: IStudent;
  public Teachers: ITeacher[];

  //学生成绩
  public ScoreName: { name: string, max: number }[] = [];
  public ScoreAvg: number[] = [];
  public TScoreAvg: number[] = [];

  //消费信息
  public ConsumptionMonth: string[] = [];
  public ConsumptionMonthMoney: number[] = [];

  public KaoqinMonth: string[] = [];
  public KaoqinMonthCnt: number[] = [];

  JumpTo(url: string) {
    if (url === "grade") {
      //这里应该是 !== -1,但是高一都有校区前缀，所以这个判断也不会出现问题
      if (this.CurrentStudent.className.indexOf("高一") >= 0) {
        this.router.navigate(["grade1"], { relativeTo: this.route });
      }
      if (this.CurrentStudent.className.indexOf("高二") >= 0) {
        this.router.navigate(["grade2"], { relativeTo: this.route });
      }
      if (this.CurrentStudent.className.indexOf("高三") >= 0) {
        this.router.navigate(["grade3"], { relativeTo: this.route });
      }
    } else {
      this.router.navigate([url], { relativeTo: this.route });
    }
  }

  JumpToClass() {
    this.service.QueryByClassId(this.CurrentStudent.classId).then(
      r => {
        if (r.length !== 0) {
          this.service.CurrentClassInfo = r;
          this.router.navigate(['class/overview', this.CurrentStudent.classId]);
        }
      }
    )
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { studentinfo: IStudentInfo }) => {

        //缓存数据
        this.service.CurrentStudentInfo = data.studentinfo;
        this.IsHeaderReady = true;
        this.CurrentStudent = data.studentinfo.baseInfo;
        this.Teachers = data.studentinfo.teachers;

        this.ScoreName = [];
        this.ScoreAvg = [];
        this.TScoreAvg = [];

        this.KaoqinMonth = [];
        this.KaoqinMonthCnt = [];

        //消费
        this.ConsumptionMonth = data.studentinfo.monthlyConsumptions.map(x => x.month.slice(0,4) + "/" + x.month.slice(4,6));
        this.ConsumptionMonthMoney = data.studentinfo.monthlyConsumptions.map(x => x.amount);
        this.CompumptionGraph.xAxis.data = this.ConsumptionMonth;
        this.CompumptionGraph.series[0].data = this.ConsumptionMonthMoney; 

        //考勤
        from(data.studentinfo.kaoqins).pipe(
          groupBy(x => x.recDateTimeYear + "/" + x.recDateTimeMonth),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            this.KaoqinMonth.push(r[0].recDateTimeYear + "/" + r[0].recDateTimeMonth);
            this.KaoqinMonthCnt.push(r.length);
          }
        )
        this.KaoqinGraph.xAxis.data = this.KaoqinMonth;
        this.KaoqinGraph.series[0].data = this.KaoqinMonthCnt;

        //课程
        data.studentinfo.chengjis.sort((x, y) => { return x.subId.localeCompare(y.subId) });
        from(data.studentinfo.chengjis).pipe(
          groupBy(x => x.subId),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            if (!CommonFunction.IsNullOrEmpty(r[0].subName) &&
              r[0].subName !== "音乐" && r[0].subName !== "体育" && r[0].subName !== "美术") {
              let sumDengdi = 0;
              let cntDengdi = 0;

              let sumT = 0;
              let cntT = 0;

              r.forEach(s => {
                if (s.numberName.indexOf("平时成绩") < 0) {
                  if (s.dengdi > 0) {
                    //去掉特殊情况
                    sumDengdi += (1 - s.dengdi) * 100;
                    cntDengdi++;
                  }
                }
                if (!isNaN(s.tScore)) {
                  sumT += 1 * s.tScore;
                  cntT++;
                }
              });

              let avg = CommonFunction.roundvalue(sumDengdi / cntDengdi);
              if (cntDengdi !== 0) {
                this.ScoreAvg.push(avg);
                this.ScoreName.push({ name: r[0].subName, max: 100 });

                //T平均分
                let avgT = CommonFunction.roundvalue(sumT / cntT);
                if (cntT !== 0) {
                  this.TScoreAvg.push(avgT);
                } else {
                  this.TScoreAvg.push(0);
                }

              }
            }
          }
        )

        this.ScoreGraph = CommonFunction.clone(ScoreRadarGraphOption);
        this.ScoreGraph.title.text = '成绩';
        this.ScoreGraph.radar.indicator = this.ScoreName;
        this.ScoreGraph.series[0].data[0].value = this.ScoreAvg;
        this.ScoreGraph.series[0].data[1].value = this.TScoreAvg;


        if (this.ScoreEchartsInstance !== undefined) {
          this.ScoreEchartsInstance.setOption(this.ScoreGraph);
        }
        if (this.KaoqinEchartsInstance !== undefined) {
          this.KaoqinEchartsInstance.setOption(this.KaoqinGraph);
        }
        if (this.CompumptionEchartsInstance !== undefined) {
          this.CompumptionEchartsInstance.setOption(this.CompumptionGraph);
        }

      });
  }
}
