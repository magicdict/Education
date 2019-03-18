import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISchoolConsumptionInfo } from 'src/app/Education.model';
import { MonthlyCompumptionOpt} from '../../GraphOption/CompumptionOption'
@Component({
  templateUrl: 'ConsumptionOverview.html',
}) 
export class ConsumptionOverviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  monthlyOpt =  (JSON.parse(JSON.stringify(MonthlyCompumptionOpt)));
  weekdayOpt =  (JSON.parse(JSON.stringify(MonthlyCompumptionOpt)));

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { consumptionInfo: ISchoolConsumptionInfo }) => {
        this.monthlyOpt.title.text = "整体月消费金额";
        this.monthlyOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x=>x.name);
        this.monthlyOpt.series[0].data = data.consumptionInfo.monthlyConsumption;

        this.weekdayOpt.title.text = "整体星期别消费金额";
        this.weekdayOpt.xAxis.data = data.consumptionInfo.weekDayConsumption.map(x=>x.name);
        this.weekdayOpt.series[0].data = data.consumptionInfo.weekDayConsumption;
      });
  }

}
