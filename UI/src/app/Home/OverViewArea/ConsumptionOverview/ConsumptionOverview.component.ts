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

  monthlyOpt = MonthlyCompumptionOpt;

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { consumptionInfo: ISchoolConsumptionInfo }) => {
        this.monthlyOpt.title.text = "整体月消费金额";
        this.monthlyOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x=>x.name);
        this.monthlyOpt.series[0].data = data.consumptionInfo.monthlyConsumption;
      });
  }

}
