import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent, IClassInfo, ITeacher, IClassExam, IStudentGroupProperty } from '../../Common/Education.model';
import { HomeService } from '../../Common/Home.service';
import { SexRatePieOption } from '../../GraphOption/StudentGraphOption'
import { ISimpleBar, ToolboxForBar } from '../../GraphOption/KaoqinOption';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { CommonFunction } from '../../Common/common';
import { ClassExamListComponent } from '../../Common/ClassExamList/ClassExamList.component';
import { ExamSubNameOption } from '../../GraphOption/ScoreOption';
import { SexRateChartOption } from '../../GraphOption/SexRateChart';

@Component({
  templateUrl: 'ClassOverview.html',
})
export class ClassOverviewComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public service: HomeService,
    private cd: ChangeDetectorRef) { }

  public QueryResult: IStudent[] = [];
  public StudentCnt: number;
  public ClassName: string;
  public ClassId: string;
  public Teachers: ITeacher[] = [];
  public Exams: IClassExam[][] = [];
  mSexRate = CommonFunction.clone(SexRateChartOption);
  KaoqinOpt: ISimpleBar;
  ConsumptionOption: any;
  ConsumptionTotalOption: any;
  KaoqinDialyOption: any;
  IsShowKaoqinGraph: boolean;

  StudentsInfo: IStudentGroupProperty;

  ngAfterViewInit() {
    //ExpressionChangedAfterItHasBeenCheckedError的对应
    //因为动态加载了Panel
    this.cd.detectChanges();
  }

  NativeEchartsInstance: any;
  onNativePlaceChartInit(event: any) {
    //console.log("地图初始化了");
    this.NativeEchartsInstance = event;
  }

  SexRateEchartsInstance: any;
  onSexRateChartInit(event: any) {
    this.SexRateEchartsInstance = event;
  }

  KaoqinEchartsInstance: any;
  onKaoqinChartInit(event: any) {
    this.KaoqinEchartsInstance = event;
  }

  ConsumptionEchartsInstance: any;
  onConsumptionChartInit(event: any) {
    this.ConsumptionEchartsInstance = event;
  }
  ConsumptionTotalEchartsInstance: any;
  onConsumptionTotalChartInit(event: any) {
    this.ConsumptionTotalEchartsInstance = event;
  }
  KaoqinDialyInstance: any;
  onKaoqinDialyChartInit(event: any) {
    this.KaoqinDialyInstance = event;
  }

  SaveSexRateImage() {
    CommonFunction.SaveChartImage(this.SexRateEchartsInstance, this.ClassName + "性别比例");
  }

  SaveKaoqinImage() {
    CommonFunction.SaveChartImage(this.KaoqinEchartsInstance, this.ClassName + "考勤统计");
  }

  cols = [
    { field: 'id', header: "学号" },
    { field: 'name', header: "姓名" },
    { field: 'sex', header: "性别" },
    { field: 'bornDate', header: "出生年" },
    { field: 'policy', header: "政治面貌" },
    { field: 'nation', header: "民族" },
    { field: 'nativePlace', header: "出生地" },
    { field: 'optionCourse', header: "七选三" }
  ];


  ngOnInit(): void {
    if (this.service.CurrentClassInfo === undefined) {
      return;
    }
    this.route.data
      .subscribe((data: { classinfo: IClassInfo }) => {
        this.QueryResult = this.service.CurrentClassInfo;
        this.StudentCnt = this.QueryResult.length;
        this.ClassName = this.QueryResult[0].className;
        this.ClassId = this.QueryResult[0].classId;
        this.StudentsInfo = data.classinfo.property;

        this.mSexRate = null;
        this.mSexRate = CommonFunction.clone(SexRateChartOption);
        this.mSexRate.title.text = this.ClassName + "性别比例";
        this.mSexRate.title['show'] = false;
        this.mSexRate.series[0].data[0].value = data.classinfo.property.sexRate.posCnt * 100 / data.classinfo.property.studentCnt;
        this.mSexRate.series[0].data[1].value = data.classinfo.property.sexRate.negCnt * 100 / data.classinfo.property.studentCnt;
        this.mSexRate.series[0].label.normal['formatter'] = (param: { value: any; }) => (param.value).toFixed(2) + '%';
        if (this.SexRateEchartsInstance !== undefined) {
          this.SexRateEchartsInstance.clear();  //不写的话label居然不更新
          this.SexRateEchartsInstance.setOption(this.mSexRate, true);
        }
        //console.log(this.mSexRate);
        this.Teachers = data.classinfo.teachers;
        this.Exams = [];
        //classTerm划分
        from(data.classinfo.exams).pipe(
          groupBy(x => x.record.term),
          mergeMap(x => x.pipe(toArray()))
        ).subscribe(
          r => {
            this.Exams.push(r.filter(x => x.record.subId !== "99" && x.record.subId !== "98"));
          }
        )
        this.Exams.sort((x, y) => {
          return x[0].record.term.localeCompare(y[0].record.term);
        });

        this.subNameOptionsMid = [];
        this.subNameOptionsFinal = [];
        this.subNameOptionsMidFinal = [];
        this.subNameOptionsMidFinalRate = [];
        this.CreateOptionForGrade("期中", this.subNameOptionsMid);
        this.CreateOptionForGrade("期末", this.subNameOptionsFinal);
        this.CreateOptionForGrade("", this.subNameOptionsMidFinal);
        this.CreateRateOptionForGrade(this.subNameOptionsMidFinalRate);

        if (data.classinfo.kaoqing.length === 0) {
          this.IsShowKaoqinGraph = false;
        } else {
          this.IsShowKaoqinGraph = true;
          this.KaoqinOpt = {
            xAxis: {
              type: 'category',
              data: data.classinfo.kaoqing.map(x => x.name)
            },
            tooltip: {},
            title: {
              text: this.ClassName + "考勤统计"
            },
            toolbox: ToolboxForBar,
            yAxis: {
              type: 'value'
            },
            series: [{
              label: {
                normal: {
                  show: true
                }
              },
              data: data.classinfo.kaoqing.map(x => x.value),
              type: 'bar'
            }]
          };
          this.KaoqinOpt.title['show'] = false;
          if (this.KaoqinEchartsInstance !== undefined) {
            try {
              this.KaoqinEchartsInstance.setOption(this.KaoqinOpt);
            } catch (error) {
              //从不显示到显示这里会报错
            }
          }
        }


        this.ConsumptionOption = {
          xAxis: {
            type: 'category',
            data: data.classinfo.consumptionStatisticsList.map(x => x.name)
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (items: any) => {
              let rtn = items[0].name + "<br />"
              rtn += "最小值：" + items[0].value + "<br />"
              rtn += "最大值：" + CommonFunction.roundvalue((items[0].value + items[1].value)) + "<br />"
              rtn += "平均值：" + (items[2].value)
              return rtn;
            }
          },
          title: {
            text: this.ClassName + "每日个人消费统计"
          },
          toolbox: ToolboxForBar,
          yAxis: [{
            type: 'value'
          }, {
            type: 'value'
          }
          ],
          series: [{
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              opacity: 0
            },
            stack: "consumption",
            data: data.classinfo.consumptionStatisticsList.map(x => CommonFunction.roundvalue(x.min)),
            type: 'bar'
          },
          {
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              opacity: 1
            },
            stack: "consumption",
            data: data.classinfo.consumptionStatisticsList.map(x => CommonFunction.roundvalue(x.max - x.min)),
            type: 'bar'
          },
          {
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              color: '#c23531',
              opacity: 1
            },
            data: data.classinfo.consumptionStatisticsList.map(x => CommonFunction.roundvalue(x.avg)),
            type: 'line',
            yAxisIndex: 1,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            },
          }]
        };

        if (this.ConsumptionEchartsInstance != undefined) {
          this.ConsumptionEchartsInstance.setOption(this.ConsumptionOption);
        }


        this.ConsumptionTotalOption = {
          xAxis: {
            type: 'category',
            data: data.classinfo.consumptionStatisticsList.map(x => x.name)
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (items: any) => {
              let rtn = items[0].name + "<br />"
              rtn += "消费金额：" + items[0].value + "<br />" + "消费人数：" + items[1].value
              return rtn;
            }
          },
          title: {
            text: this.ClassName + "每日全体消费统计"
          },
          toolbox: ToolboxForBar,
          yAxis: [{
            name: '金额',
            type: 'value'
          },
          {
            name: '人数',
            type: 'value'
          }
          ],
          series: [{
            label: {
              normal: {
                show: false
              }
            },
            stack: "consumption",
            data: data.classinfo.consumptionStatisticsList.map(x => CommonFunction.roundvalue(x.sum)),
            type: 'bar',
            itemStyle: {
              color: '#2f4554',
              opacity: 1
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            },
          },
          {
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              color: '#c23531',
              opacity: 1
            },
            data: data.classinfo.consumptionStatisticsList.map(x => CommonFunction.roundvalue(x.cnt)),
            type: 'line',
            yAxisIndex: 1,
          }]
        };

        if (this.ConsumptionTotalEchartsInstance != undefined) {
          this.ConsumptionTotalEchartsInstance.setOption(this.ConsumptionTotalOption);
        }

        this.KaoqinDialyOption = {
          xAxis: {
            type: 'category',
            data: data.classinfo.kaoqingStatisticsList.map(x => x.name)
          },
          title: {
            text: this.ClassName + "每日考勤统计"
          },
          toolbox: ToolboxForBar,
          yAxis: [{
            name: '次数',
            type: 'value'
          }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (items: any) => {
              let rtn = items[0].name + "<br />";
              rtn += "迟到" + items[0].value + "<br />";
              rtn += "校服" + items[1].value + "<br />";
              rtn += "早退" + items[2].value + "<br />";
              rtn += "离校" + items[3].value + "<br />";
              rtn += "进校" + items[4].value + "<br />";
              return rtn;
            }
          },
          legend: {
            show: true,
            data: ["迟到", "校服", "早退", "离校", "进校"]
          },
          series: [
            {
              label: {
                normal: {
                  show: false
                }
              },
              stack: "kaoqin",
              data: data.classinfo.kaoqingStatisticsList.map(x => this.getkaoqingStatisticsData("迟到", x)),
              type: 'bar', name: "迟到"
            },
            {
              label: {
                normal: {
                  show: false
                }
              },
              stack: "kaoqin",
              data: data.classinfo.kaoqingStatisticsList.map(x => this.getkaoqingStatisticsData("校服", x)),
              type: 'bar', name: "校服"
            },
            {
              label: {
                normal: {
                  show: false
                }
              },
              stack: "kaoqin",
              data: data.classinfo.kaoqingStatisticsList.map(x => this.getkaoqingStatisticsData("早退", x)),
              type: 'bar', name: "早退"
            },
            {
              label: {
                normal: {
                  show: false
                }
              },
              stack: "kaoqin",
              data: data.classinfo.kaoqingStatisticsList.map(x => this.getkaoqingStatisticsData("离校", x)),
              type: 'bar', name: "离校"
            },
            {
              label: {
                normal: {
                  show: false
                }
              },
              stack: "kaoqin",
              data: data.classinfo.kaoqingStatisticsList.map(x => this.getkaoqingStatisticsData("进校", x)),
              type: 'bar', name: "进校"
            }

          ]
        };

        if (this.KaoqinDialyInstance != undefined) {
          try {
            this.KaoqinDialyInstance.setOption(this.KaoqinDialyOption);
          } catch (error) {

          }
        }


      });
  }

  getkaoqingStatisticsData(detailId: string, data: { name: string, value: { name: string, value: number }[] }): number {
    let n = 0;
    data.value.forEach(element => {
      if (element.name === detailId) n = element.value;
    });
    return n;
  }

  subNameList = ['语文', '数学', '英语', '历史', '政治', '生物', '物理', '化学', '地理'];
  subNameOptionsMid: any[] = [];
  subNameOptionsFinal: any[] = [];
  subNameOptionsMidFinal: any[] = [];
  subNameOptionsMidFinalRate: any[] = [];
  CreateRateOptionForGrade(optarray: any[]) {
    this.subNameList.forEach(
      subname => {
        let opt = CommonFunction.clone(ExamSubNameOption);
        opt.title.text = subname + "考试趋势"
        opt.legend.data = ['最高得分率', '最低得分率', '平均得分率']
        opt.series[0].name = '最高得分率';
        opt.series[1].name = '最低得分率';
        opt.series[2].name = '平均得分率';
        let High = [];
        let Low = [];
        let Avg = [];
        let xAxis = [];
        this.Exams.forEach(examlist => {
          if (this.ClassName.indexOf("高二") !== -1) {
            //对于高二的修正

            let rate = 100;
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === "期中");
            if (x !== undefined) {
              High.push(CommonFunction.roundvalue(x.maxScore / rate));
              Low.push(CommonFunction.roundvalue(x.minScore / rate));
              Avg.push(CommonFunction.roundvalue(x.avgScore / rate));
              xAxis.push(x.record.term + "期中")
            }

            if (subname === "语文" || subname === "数学" || subname == "英语") {
              rate = 150;
            }
            let y = examlist.find(x => x.record.subName === subname && x.record.typeName === "期末");
            if (y !== undefined) {
              High.push(CommonFunction.roundvalue(y.maxScore / rate));
              Low.push(CommonFunction.roundvalue(y.minScore / rate));
              Avg.push(CommonFunction.roundvalue(y.avgScore / rate));
              xAxis.push(y.record.term + "期末")
            }
          }
          if (this.ClassName.indexOf("高三") !== -1) {
            //对于高三的修正
            let rate = 100;
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === "期中");
            if (x !== undefined) {
              if (subname === "语文") {
                if (x.record.term == "2018-2019-1") rate = 150;
              }
              High.push(CommonFunction.roundvalue(x.maxScore / rate));
              Low.push(CommonFunction.roundvalue(x.minScore / rate));
              Avg.push(CommonFunction.roundvalue(x.avgScore / rate));
              xAxis.push(x.record.term + "期中")
            }

            let y = examlist.find(x => x.record.subName === subname && x.record.typeName === "期末");
            if (y !== undefined) {
              if (subname === "语文" || subname === "数学" || subname == "英语") {
                if (y.record.term == "2016-2017-1") rate = 150;
                if (y.record.term == "2017-2018-1") rate = 150;
                if (y.record.term == "2017-2018-2") rate = 150;
              }
              High.push(CommonFunction.roundvalue(y.maxScore / rate));
              Low.push(CommonFunction.roundvalue(y.minScore / rate));
              Avg.push(CommonFunction.roundvalue(y.avgScore / rate));
              xAxis.push(y.record.term + "期末")
            }
          }
        });
        opt.series[0].data = High;
        opt.series[1].data = Low;
        opt.series[2].data = Avg;
        opt.xAxis.data = xAxis;
        optarray.push(opt);
      }
    )
  }
  CreateOptionForGrade(typeName: string, optarray: any[]) {
    this.subNameList.forEach(
      subname => {
        let opt = CommonFunction.clone(ExamSubNameOption);
        opt.title.text = subname + typeName + "考试趋势"
        let High = [];
        let Low = [];
        let Avg = [];
        let xAxis = [];
        this.Exams.forEach(examlist => {

          if (typeName === "") {
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === "期中");
            if (x !== undefined) {
              High.push(x.maxScore);
              Low.push(x.minScore);
              Avg.push(x.avgScore);
              xAxis.push(x.record.term + "期中")
            }
            let y = examlist.find(x => x.record.subName === subname && x.record.typeName === "期末");
            if (y !== undefined) {
              High.push(y.maxScore);
              Low.push(y.minScore);
              Avg.push(y.avgScore);
              xAxis.push(y.record.term + "期末")
            }
          } else {
            let x = examlist.find(x => x.record.subName === subname && x.record.typeName === typeName);
            if (x !== undefined) {
              High.push(x.maxScore);
              Low.push(x.minScore);
              Avg.push(x.avgScore);
              xAxis.push(x.record.term)
            }
          }
        });
        opt.series[0].data = High;
        opt.series[1].data = Low;
        opt.series[2].data = Avg;
        opt.xAxis.data = xAxis;
        optarray.push(opt);
      }
    )
  }

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }
  JumpToTeacher(teacherid: string) {
    this.router.navigate(['teacher/overview', teacherid]);
  }

  @ViewChild("classExamList")
  classExamList: ClassExamListComponent;

  //Panel里面带滚动条表格的修复
  IsFirst = true;
  handleChange(e: { index: any; }) {
    var index = e.index;
    if (index !== 3) return;
    if (this.IsFirst) {
      this.IsFirst = false;
      this.classExamList.ResetScroll();
    }
  }
}
