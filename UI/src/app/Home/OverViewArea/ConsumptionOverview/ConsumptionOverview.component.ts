import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolConsumptionInfo, IConsumption, IStudent, IStudentMonthlyConsumption } from 'src/app/Home/Common/Education.model';
import { MonthlyCompumptionBarOption, MonthlyCompumptionBarOptionTotal, DairyCanlendarOption } from '../../GraphOption/CompumptionOption'
import { HomeService } from '../../Common/Home.service';
import { CommonFunction } from '../../Common/common';
import { StudentPickerComponent } from '../../Common/studentPicker/studentPicker.component';
import { ISimpleBar, ToolboxForBar, ToolboxSaveImageOnly } from '../../GraphOption/KaoqinOption';
import { MessageService } from 'primeng/api';
@Component({
  templateUrl: 'ConsumptionOverview.html',
  providers: [MessageService],
})
export class ConsumptionOverviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public service: HomeService
  ) { }

  cols = [
    { field: 'id', header: "学号" },
    { field: 'name', header: "姓名" },
    { field: 'className', header: "班级" },
    { field: 'sex', header: "性别" },
    { field: 'liveAtSchool', header: "住校" },
    { field: 'month', header: "月度" },
    { field: 'amount', header: "金额" },
  ];

  dailyOpt = CommonFunction.clone(DairyCanlendarOption);
  dailycntOpt = CommonFunction.clone(DairyCanlendarOption);
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
  IsShowToast = false;
  MonthUpLimit = 0;

  public Students: IStudentMonthlyConsumption[] = [];
  public selectStudent: IStudentMonthlyConsumption;



  hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'];
  days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  WeekTimeOptionSample = {
    tooltip: {
      position: 'top',
      formatter: (val: any) => { return val.data[1]; }
    },
    toolbox: {
      'show': true,
      'feature': {
        'saveAsImage': {},
      }
    },
    title: [],
    singleAxis: [],
    series: []
  };

  WeekTimeLineOptionSample = {
    baseOption: {
      timeline: {
        axisType: 'category',
        show: true,
        autoPlay: true,
        playInterval: 1000,
        data: this.days
      },
      toolbox: {
        'show': true,
        'feature': {
          'saveAsImage': {},
        }
      },
      title: [],
      singleAxis: [
        {
          left: 150,
          type: 'category',
          boundaryGap: false,
          data: this.hours,
          top: 10,
          height: 200,
          axisLabel: {
            interval: 2
          }
        }
      ],
      series: [
        {
          singleAxisIndex: 0,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          symbolSize: (dataItem: number[]) => {
            return dataItem[1] / 4000;
          }
        }
      ]
    },
    options: [
      {
        title: {
          text: '周一'
        },
        series: [{
          data: []
        }]
      },
      {
        title: {
          text: '周二'
        },
        series: [{
          data: []
        }]
      },
      {
        title: {
          text: '周三'
        },
        series: [{
          data: []
        }]
      },
      {
        title: {
          text: '周四'
        },
        series: [{
          data: []
        }]
      },
      {
        title: {
          text: '周五'
        },
        series: [{
          data: []
        }]
      },
      {
        title: {
          text: '周六'
        },
        series: [{
          data: []
        }]
      },
      {
        title: {
          text: '周日'
        },
        series: [{
          data: []
        }]
      },
    ]
  }


  WeekTimeOptionSample3D = {
    visualMap: {
      max: 300000,
      show: false,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      type: 'category',
      data: this.hours,
      name: '时间'
    },
    yAxis3D: {
      type: 'category',
      data: this.days,
      name: '周次'
    },
    zAxis3D: {
      type: 'value',
      name: '金额'
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      viewControl: {
        projection: 'orthographic'
      },
      light: {
        main: {
          intensity: 1.2
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    series: [{
      type: 'bar3D',
      data: [],
      shading: 'color',
      label: {
        formatter: '{c}'
      },
      itemStyle: {
        opacity: 0.4
      },
    }]
  }

  WeekTimeOption = CommonFunction.clone(this.WeekTimeOptionSample);
  WeekTimeLiveAtSchoolOption = CommonFunction.clone(this.WeekTimeOptionSample);
  WeekTimeNotLiveAtSchoolOption = CommonFunction.clone(this.WeekTimeOptionSample);

  WeekTimeLineOption = CommonFunction.clone(this.WeekTimeLineOptionSample);
  WeekTimeLineLiveAtSchoolOption = CommonFunction.clone(this.WeekTimeLineOptionSample);
  WeekTimeLineNotLiveAtSchoolOption = CommonFunction.clone(this.WeekTimeLineOptionSample);

  WeekTimeOption3D = CommonFunction.clone(this.WeekTimeOptionSample3D)

  SetWeekTimeOption(WeekTimeOptionInstance: any, dataItems: number[][]) {
    WeekTimeOptionInstance.title = [];
    WeekTimeOptionInstance.singleAxis = [];
    WeekTimeOptionInstance.series = [];

    for (let idx = 0; idx < 7; idx++) {
      let day = this.days[idx];
      WeekTimeOptionInstance.title.push({
        textBaseline: 'middle',
        top: (idx + 0.5) * 100 / 7 + '%',
        text: day
      });
      WeekTimeOptionInstance.singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: this.hours,
        top: (idx * 100 / 7 + 5) + '%',
        height: (100 / 7 - 10) + '%',
        axisLabel: {
          interval: 2
        }
      });
      WeekTimeOptionInstance.series.push({
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
      WeekTimeOptionInstance.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });
  }

  SetWeekTimeLineOption(WeekTimeLineOptionInstance: any, dataItems: number[][]) {

    WeekTimeLineOptionInstance.baseOption.series[0].symbolSize = (dataItem: number[]) => {
      return dataItem[1] / 4000;
    };
    //dataItem[0] 周次下标
    //dataItem[1] 时间下标
    //dataItem[2] 金额
    for (let idx = 0; idx < 7; idx++) {
      WeekTimeLineOptionInstance.options[idx].series[0].data = [];
    }
    dataItems.forEach(dataItem => {
      WeekTimeLineOptionInstance.options[dataItem[0]].series[0].data.push([dataItem[1], dataItem[2]]);
    });
  }


  symbolSize(val: any[]) {
    return val[1] / 2500;
  }

  symbolSizeCnt(val: any[]) {
    return val[1] / 100;
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { consumptionInfo: ISchoolConsumptionInfo }) => {
        this.dailyOpt.visualMap[0].max = 50000;
        this.dailyOpt.series[0].symbolSize = this.symbolSize;
        this.dailyOpt.series[1].symbolSize = this.symbolSize;
        this.dailyOpt.series[0].data = data.consumptionInfo.dailyConsumption.map(x => { return [x.name, x.value * -1]; });
        this.dailyOpt.series[1].data = data.consumptionInfo.dailyConsumption.map(x => { return [x.name, x.value * -1]; });

        this.dailycntOpt.visualMap[0].max = 1700;
        this.dailycntOpt.series[0].symbolSize = this.symbolSizeCnt;
        this.dailycntOpt.series[1].symbolSize = this.symbolSizeCnt;
        this.dailycntOpt.series[0].data = data.consumptionInfo.dailyConsumptionStudentCnt.map(x => { return [x.name, x.value]; });
        this.dailycntOpt.series[1].data = data.consumptionInfo.dailyConsumptionStudentCnt.map(x => { return [x.name, x.value]; });

        this.monthlyTotalOpt.title.text = "整体月消费金额";
        this.monthlyTotalOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x => x.name);
        this.monthlyTotalOpt.series[0].data = data.consumptionInfo.monthlyConsumption;

        this.monthlyOpt.title.text = "整体月消费金额";
        this.monthlyOpt.xAxis.data = data.consumptionInfo.monthlyConsumption.map(x => x.name);
        this.monthlyOpt.series[0].data = data.consumptionInfo.monthlyConsumptionLiveAtSchool;
        this.monthlyOpt.series[1].data = data.consumptionInfo.monthlyConsumptionNotLiveAtSchool;

        this.weekdayTotalOpt.title.text = "整体周别消费金额";
        this.weekdayTotalOpt.xAxis.data = data.consumptionInfo.weekDayConsumption.map(x => x.name);
        this.weekdayTotalOpt.series[0].data = data.consumptionInfo.weekDayConsumption;

        this.weekdayOpt.title.text = "整体周别消费金额";
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

        this.SetWeekTimeOption(this.WeekTimeOption, data.consumptionInfo.weekTimeConsumption
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));

        this.SetWeekTimeOption(this.WeekTimeLiveAtSchoolOption, data.consumptionInfo.weekTimeConsumptionLiveAtSchool
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));

        this.SetWeekTimeOption(this.WeekTimeNotLiveAtSchoolOption, data.consumptionInfo.weekTimeConsumptionNotLiveAtSchool
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));

        //时间线  
        this.SetWeekTimeLineOption(this.WeekTimeLineOption, data.consumptionInfo.weekTimeConsumption
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));

        this.SetWeekTimeLineOption(this.WeekTimeLineLiveAtSchoolOption, data.consumptionInfo.weekTimeConsumptionLiveAtSchool
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));

        this.SetWeekTimeLineOption(this.WeekTimeLineNotLiveAtSchoolOption, data.consumptionInfo.weekTimeConsumptionNotLiveAtSchool
          .map(x => { return [Number.parseInt(x.name.split('-')[0]), Number.parseInt(x.name.split('-')[1]), x.value]; }));

        //三维图形
        this.WeekTimeOption3D.series[0].data = data.consumptionInfo.weekTimeConsumption.filter(x => x.value !== 0)
          .map(x => { return [Number.parseInt(x.name.split('-')[1]), Number.parseInt(x.name.split('-')[0]), x.value]; })

        this.PerRangeCntOption = {
          title: {
            text: '单笔消费金额'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [{
            name: '单笔消费金额',
            label: {
              normal: {
                formatter: '{b|{b}}{abg|}\n{hr|}\n {c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  b: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: data.consumptionInfo.perPriceRange,
            type: 'pie',
            radius: ['40%', '70%'],
          }]
        };
        this.PerRangeCntOption['grid'] = { left: 100 };
        this.PerRangeCntOption.toolbox = ToolboxSaveImageOnly;

        this.PerDayByGradeOption = {
          title: {
            text: '年级别日均消费'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: ["高一", "高二", "高三"]
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            label: {
              normal: {
                show: true
              }
            },
            data: data.consumptionInfo.perDayByGrade.map(x => -1 * x.value),
            type: 'bar'
          }]
        };
        this.PerDayByGradeOption['grid'] = { left: 100 };
        this.PerDayByGradeOption.toolbox = ToolboxForBar;


        //Polar:
        //Minute
        this.MinuteFrom6.title.text = "早高峰消费情况";
        this.MinuteFrom6.angleAxis.data = data.consumptionInfo.minuteList.slice(360, 480);
        this.MinuteFrom6.series[0].data = data.consumptionInfo.timePolar00000.map(x => x.value).slice(360, 480);

        this.MinuteFrom11.title.text = "午高峰消费情况";
        this.MinuteFrom11.angleAxis.data = data.consumptionInfo.minuteList.slice(660, 780);
        this.MinuteFrom11.series[0].data = data.consumptionInfo.timePolar00000.map(x => x.value).slice(660, 780);

        this.MinuteFrom16.title.text = "晚高峰消费情况";
        this.MinuteFrom16.angleAxis.data = data.consumptionInfo.minuteList.slice(1020, 1140);
        this.MinuteFrom16.series[0].data = data.consumptionInfo.timePolar00000.map(x => x.value).slice(1020, 1140);

      });

  }

  /**单笔消费金额统计 */
  PerRangeCntOption: any;
  /**年级别日均消费统计 */
  PerDayByGradeOption: ISimpleBar;

  QueryByMonthUpLimit() {
    this.service.GetStudentWithMonthLimit(this.MonthUpLimit).then(
      r => {
        this.Students = r;
        if (this.IsShowToast) this.messageService.add({ severity: 'success', summary: '查询完毕', detail: '符合条件人数：' + r.length });
        this.IsShowToast = true;  //控制OnInit的时候不出现Toast
      }
    );
  }


  HourMinuteOption = {
    title: {
      text: ""
    },
    angleAxis: {
      type: 'category',
      data: [],
      z: 10,
      interval: 50
    },
    tooltip: {},
    toolbox: ToolboxSaveImageOnly,
    radiusAxis: {
    },
    polar: {
    },
    series: [{
      type: 'bar',
      data: [],
      coordinateSystem: 'polar',
    }],
  };

  MinuteFrom6 = CommonFunction.clone(this.HourMinuteOption);
  MinuteFrom11 = CommonFunction.clone(this.HourMinuteOption);
  MinuteFrom16 = CommonFunction.clone(this.HourMinuteOption);




  WeekTimeOption3DChartInstance: any;
  onWeekTimeOption3DChartInit(event: any) {
    this.WeekTimeOption3DChartInstance = event;
  }

  SaveWeekTimeOption3DChartImage() {
    CommonFunction.SaveChartImage(this.WeekTimeOption3DChartInstance, "时段周别统计（3D）")
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
