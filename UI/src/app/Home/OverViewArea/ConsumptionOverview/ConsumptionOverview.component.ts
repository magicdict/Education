import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolConsumptionInfo, IConsumption, IStudent, IStudentMonthlyConsumption } from 'src/app/Home/Common/Education.model';
import { MonthlyCompumptionBarOption, MonthlyCompumptionBarOptionTotal } from '../../GraphOption/CompumptionOption'
import { HomeService } from '../../Common/Home.service';
import { CommonFunction } from '../../Common/common';
@Component({
  templateUrl: 'ConsumptionOverview.html',
})
export class ConsumptionOverviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: HomeService
  ) { }

  monthlyOpt = CommonFunction.clone(MonthlyCompumptionBarOption);
  weekdayOpt = CommonFunction.clone(MonthlyCompumptionBarOption);

  monthlyTotalOpt = CommonFunction.clone(MonthlyCompumptionBarOptionTotal);
  weekdayTotalOpt = CommonFunction.clone(MonthlyCompumptionBarOptionTotal);

  highestRec: IConsumption[];
  highestRecLiveAtSchool: IConsumption[];
  highestRecNotLiveAtSchool: IConsumption[];

  liveAtSchool: number;
  notLiveAtSchool: number;

  //消费预警
  MonthUpLimitList = [
    { label: '1000元', value: 1000 },
    { label: '1100元', value: 1100 },
    { label: '1200元', value: 1200 },
    { label: '1300元', value: 1300 },
    { label: '1400元', value: 1400 },
  ]
  MonthUpLimit = 0;

  public Students: IStudentMonthlyConsumption[] = [];

  public selectStudent: IStudentMonthlyConsumption;

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { consumptionInfo: ISchoolConsumptionInfo }) => {

        this.monthlyTotalOpt.title.text = "整体月消费金额";
        this.monthlyTotalOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x => x.name);
        this.monthlyTotalOpt.series[0].data = data.consumptionInfo.monthlyConsumption;

        this.monthlyOpt.title.text = "整体月消费金额";
        this.monthlyOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x => x.name);
        this.monthlyOpt.series[0].data = data.consumptionInfo.monthlyConsumptionLiveAtSchool;
        this.monthlyOpt.series[1].data = data.consumptionInfo.monthlyConsumptionNotLiveAtSchool;

        this.weekdayTotalOpt.title.text = "整体星期别消费金额";
        this.weekdayTotalOpt.xAxis.data = data.consumptionInfo.weekDayConsumption.map(x => x.name);
        this.weekdayTotalOpt.series[0].data = data.consumptionInfo.weekDayConsumption;

        this.weekdayOpt.title.text = "整体星期别消费金额";
        this.weekdayOpt.xAxis.data = data.consumptionInfo.weekDayConsumption.map(x => x.name);
        this.weekdayOpt.series[0].data = data.consumptionInfo.weekDayConsumptionLiveAtSchool;
        this.weekdayOpt.series[1].data = data.consumptionInfo.weekDayConsumptionNotLiveAtSchool;

        this.highestRec = data.consumptionInfo.highestRec;
        this.highestRecLiveAtSchool = data.consumptionInfo.highestRecLiveAtSchool;
        this.highestRecNotLiveAtSchool = data.consumptionInfo.highestRecNotLiveAtSchool;

        this.liveAtSchool = data.consumptionInfo.liveAtSchoolCnt;
        this.notLiveAtSchool = data.consumptionInfo.notLiveAtSchoolCnt;

      });
  }

  QueryByMonthUpLimit() {
    this.service.GetStudentWithMonthLimit(this.MonthUpLimit).then(
      r => {
        this.Students = r;
      }
    );
  }

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }

  JumpTo(studentId: string) {
    this.router.navigate(['student/overview', studentId]);
  }

}
