import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolConsumptionInfo, IConsumption } from 'src/app/Education.model';
import { MonthlyCompumptionBarOption} from '../../GraphOption/CompumptionOption'
@Component({
  templateUrl: 'ConsumptionOverview.html',
}) 
export class ConsumptionOverviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  monthlyOpt =  (JSON.parse(JSON.stringify(MonthlyCompumptionBarOption)));
  weekdayOpt =  (JSON.parse(JSON.stringify(MonthlyCompumptionBarOption)));
  highestRec:IConsumption[];

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { consumptionInfo: ISchoolConsumptionInfo }) => {
        this.monthlyOpt.title.text = "整体月消费金额";
        this.monthlyOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x=>x.name);
        this.monthlyOpt.series[0].data = data.consumptionInfo.monthlyConsumption;

        this.weekdayOpt.title.text = "整体星期别消费金额";
        this.weekdayOpt.xAxis.data = data.consumptionInfo.weekDayConsumption.map(x=>x.name);
        this.weekdayOpt.series[0].data = data.consumptionInfo.weekDayConsumption;

        this.highestRec = data.consumptionInfo.highestRec;

      });
  }

  JumpTo(studentId:string){
    this.router.navigate(['student/overview', studentId]);
  }

}
