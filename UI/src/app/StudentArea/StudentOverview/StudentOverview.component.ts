import { Component, OnInit } from '@angular/core';
import { StudentService } from '../Student.service';
import { IStudent, IStudentInfo, IConsumption } from '../student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { from } from 'rxjs';
import { CommonFunction } from 'src/app/common';

@Component({
  templateUrl: 'StudentOverview.html',
})
export class StudentOverviewComponent implements OnInit {
  ngOnInit(): void {
    this.ConsumptionMonth = [];
    this.ConsumptionMonthMoney = [];

    this.route.data
      .subscribe((data: { studentinfo: IStudentInfo }) => {
        this.CurrentStudent = data.studentinfo.baseInfo;
        this.ConsumptionRecords = data.studentinfo.consumptions;
        from(this.ConsumptionRecords).pipe(
          groupBy(x => x.dealTimeYear + "/" + x.dealTimeMonth),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            this.ConsumptionMonth.push(r[0].dealTimeYear + "/" + r[0].dealTimeMonth);
            this.ConsumptionMonthMoney.push(Number(CommonFunction.roundvalue(r.map(x => -x.monDeal).reduce((sum, current) => sum + current))));
          }
        )
        this.option.xAxis.data = this.ConsumptionMonth;
        this.option.series[0].data = this.ConsumptionMonthMoney;

      });
  }
  constructor(
    public studentSerice: StudentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  public CurrentStudent: IStudent;
  public ConsumptionRecords: IConsumption[];

  public ConsumptionMonth: string[];
  public ConsumptionMonthMoney: number[];

  option = {
    title: {
      text: '消费记录'
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

  option2 = {
    title: {
      text: '学习成绩'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: this.ConsumptionMonth
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: this.ConsumptionMonthMoney
    }]
  };

}
