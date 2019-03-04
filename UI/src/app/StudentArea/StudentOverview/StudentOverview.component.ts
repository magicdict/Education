import { Component, OnInit } from '@angular/core';
import { StudentService } from '../Student.service';
import { IStudent, IStudentInfo, ITeacher } from '../student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { from } from 'rxjs';
import { CommonFunction } from 'src/app/common';

@Component({
  templateUrl: 'StudentOverview.html',
})
export class StudentOverviewComponent implements OnInit {

  constructor(
    public studentSerice: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { studentinfo: IStudentInfo }) => {

        //缓存数据
        this.studentSerice.CurrentStudentInfo = data.studentinfo;

        this.CurrentStudent = data.studentinfo.baseInfo;
        this.Teachers = data.studentinfo.teachers;

        from(data.studentinfo.consumptions).pipe(
          groupBy(x => x.dealTimeYear + "/" + x.dealTimeMonth),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            this.ConsumptionMonth.push(r[0].dealTimeYear + "/" + r[0].dealTimeMonth);
            this.ConsumptionMonthMoney.push(Number(CommonFunction.roundvalue(r.map(x => -x.monDeal).reduce((sum, current) => sum + current))));
          }
        )
        this.CompumptionGraph.xAxis.data = this.ConsumptionMonth;
        this.CompumptionGraph.series[0].data = this.ConsumptionMonthMoney;


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

        from(data.studentinfo.chengjis).pipe(
          groupBy(x => x.subId),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            if (!CommonFunction.IsNullOrEmpty(r[0].subName)) {
              let sum = 0;
              let cnt = 0;

              let sumT = 0;
              let cntT = 0;

              r.forEach(s => {
                if (s.numberName.indexOf("平时成绩") < 0) {
                  if (s.score > 0) {
                    //去掉特殊情况
                    sum += 1 * s.score;
                    cnt++;
                  }
                }
                if (!isNaN(s.tScore)) {
                  sumT += 1 * s.tScore;
                  cntT++;
                }
              });

              let avg = CommonFunction.roundvalue(sum / cnt);
              if (cnt !== 0) {
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
        this.ScoreGraph.radar.indicator = this.ScoreName;
        this.ScoreGraph.series[0].data[0].value = this.ScoreAvg;
        this.ScoreGraph.series[0].data[1].value = this.TScoreAvg;

      });
  }
  
  JumpTo(url:string){
    this.router.navigate([url], { relativeTo: this.route });
  }


  public CurrentStudent: IStudent;
  public Teachers: ITeacher[];

  public ConsumptionMonth: string[] = [];
  public ConsumptionMonthMoney: number[] = [];

  CompumptionGraph = {
    title: {
      text: "消费记录（月度）"
    },
    tooltip: {},
    legend: {
      data: ['消费额']
    },
    xAxis: {
      data: this.ConsumptionMonth
    },
    yAxis: {},
    series: [{
      name: '消费额',
      type: 'bar',
      data: this.ConsumptionMonthMoney
    }]
  };

  public KaoqinMonth: string[] = [];
  public KaoqinMonthCnt: number[] = [];

  KaoqinGraph = {
    title: {
      text: '考勤（月度）'
    },
    tooltip: {},
    legend: {
      data: ['次数']
    },
    xAxis: {
      data: this.KaoqinMonth
    },
    yAxis: {},
    series: [{
      name: '次数',
      type: 'bar',
      data: this.KaoqinMonthCnt
    }]
  };


  public ScoreName: { name: string, max: number }[] = [];
  public ScoreAvg: number[] = [];
  public TScoreAvg: number[] = [];

  ScoreGraph = {
    title: {
      text: '成绩'
    },
    tooltip: {},
    legend: {
      data: ['各科平均分','各科T平均分']
    },
    radar: {
      // shape: 'circle',
      name: {
        textStyle: {
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5]
        }
      },
      indicator:
        this.ScoreName
    },
    series: [{
      name: '各科平均分',
      type: 'radar',
      data: [
        {
          value: this.ScoreAvg,
          name: '各科平均分'
        },
        {
          value: this.TScoreAvg,
          name: '各科T平均分'
        }
      ]
    }]
  };

}
