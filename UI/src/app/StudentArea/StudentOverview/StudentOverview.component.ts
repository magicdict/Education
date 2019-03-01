import { Component, OnInit } from '@angular/core';
import { StudentService } from '../Student.service';
import { IStudent, IStudentInfo, IConsumption, ITeacher } from '../student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { from } from 'rxjs';
import { CommonFunction } from 'src/app/common';

@Component({
  templateUrl: 'StudentOverview.html',
})
export class StudentOverviewComponent implements OnInit {
  ngOnInit(): void {
    this.route.data
      .subscribe((data: { studentinfo: IStudentInfo }) => {
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
      });
  }
  constructor(
    public studentSerice: StudentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  public CurrentStudent: IStudent;
  public Teachers:ITeacher[];

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

}
