import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolConsumptionInfo, IConsumption, IStudent, IStudentMonthlyConsumption } from 'src/app/Home/Common/Education.model';
import { MonthlyCompumptionBarOption, MonthlyCompumptionBarOptionTotal, DairyCanlendarOption } from '../../GraphOption/CompumptionOption'
import { HomeService } from '../../Common/Home.service';
import { CommonFunction } from '../../Common/common';
import { StudentPickerComponent } from '../../Common/studentPicker/studentPicker.component';
@Component({
  templateUrl: 'ConsumptionOverview.html',
})
export class ConsumptionOverviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: HomeService
  ) { }

  cols = [
    { field: 'id', header: "学号" },
    { field: 'name', header: "姓名" },
    { field: 'className', header: "班级" },
    { field: 'sex', header: "性别" },
    { field: 'liveAtSchool', header: "是否住校" },
    { field: 'month', header: "月度" },
    { field: 'amount', header: "金额" },
  ];

  dailyOpt = CommonFunction.clone(DairyCanlendarOption);
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

  symbolSize(val: any[]) {
    return val[1] / 2500;
  }

  WeekTimeOption = {
    tooltip: {
      position: 'top',
      formatter: (val: any) => { return val.data[1]; }
    },
    title: [],
    singleAxis: [],
    series: []
  };

  SetWeekTimeOption(dataItems: number[][]) {
    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
      '7a', '8a', '9a', '10a', '11a',
      '12p', '1p', '2p', '3p', '4p', '5p',
      '6p', '7p', '8p', '9p', '10p', '11p'];
    var days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

    this.WeekTimeOption.title = [];
    this.WeekTimeOption.singleAxis = [];
    this.WeekTimeOption.series = [];

    for (let idx = 0; idx < 7; idx++) {
      let day = days[idx];
      this.WeekTimeOption.title.push({
        textBaseline: 'middle',
        top: (idx + 0.5) * 100 / 7 + '%',
        text: day
      });
      this.WeekTimeOption.singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: (idx * 100 / 7 + 5) + '%',
        height: (100 / 7 - 10) + '%',
        axisLabel: {
          interval: 2
        }
      });
      this.WeekTimeOption.series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: (dataItem: number[]) => {
          return dataItem[1] / 4000;
        }
      });
    }
    dataItems.forEach(dataItem => {
      this.WeekTimeOption.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });

    //console.log(this.WeekTimeOption);
  }


  ngOnInit(): void {
    this.route.data
      .subscribe((data: { consumptionInfo: ISchoolConsumptionInfo }) => {
        this.dailyOpt.series[0].symbolSize = this.symbolSize;
        this.dailyOpt.series[1].symbolSize = this.symbolSize;
        this.dailyOpt.series[0].data = data.consumptionInfo.dailyConsumption.map(x => { return [x.name, x.value * -1]; });
        this.dailyOpt.series[1].data = data.consumptionInfo.dailyConsumption.map(x => { return [x.name, x.value * -1]; });

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

        this.MonthUpLimit = 1000;
        this.QueryByMonthUpLimit();

        this.SetWeekTimeOption(data.consumptionInfo.weekTimeConsumption
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));
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

  @ViewChild(StudentPickerComponent)
  private studentpicker: StudentPickerComponent;
  // 订阅句柄
  private pickhandler: any;

  StudentQuery() {
    if (this.pickhandler !== null && this.pickhandler !== undefined) {
      // 需要把上次的订阅取消掉，不然的话，多个订阅会同时发生效果！
      this.pickhandler.unsubscribe();
    }
    this.pickhandler = this.studentpicker.pick.subscribe((student: IStudent) => {
      this.service.GetStudentMonthlyConsumption(student.id).then(
        r => {
          this.Students = r;
        }
      );
    });
    this.studentpicker.show();
  }
}
