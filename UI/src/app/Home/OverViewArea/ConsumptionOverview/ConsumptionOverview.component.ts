import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolConsumptionInfo, IConsumption } from 'src/app/Home/Common/Education.model';
import { MonthlyCompumptionBarOption, MonthlyCompumptionBarOptionTotal } from '../../GraphOption/CompumptionOption'
@Component({
  templateUrl: 'ConsumptionOverview.html',
})
export class ConsumptionOverviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  monthlyOpt = (JSON.parse(JSON.stringify(MonthlyCompumptionBarOption)));
  weekdayOpt = (JSON.parse(JSON.stringify(MonthlyCompumptionBarOption)));

  monthlyTotalOpt = (JSON.parse(JSON.stringify(MonthlyCompumptionBarOptionTotal)));
  weekdayTotalOpt = (JSON.parse(JSON.stringify(MonthlyCompumptionBarOptionTotal)));

  highestRec: IConsumption[];
  highestRecLiveAtSchool: IConsumption[];
  highestRecNotLiveAtSchool: IConsumption[];

  liveAtSchool :number;  
  notLiveAtSchool :number;  

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

  JumpTo(studentId: string) {
    this.router.navigate(['student/overview', studentId]);
  }

}
