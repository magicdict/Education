import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolInfo } from '../../Common/Education.model';
import { SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { HomeService } from '../../Common/Home.service';
import { echartsInstance } from 'echarts'
import { CommonFunction } from '../../Common/common';
import { ISimpleBar } from '../../GraphOption/KaoqinOption';

@Component({
  templateUrl: 'SchoolOverView.html',
})
export class SchoolOverViewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: HomeService
  ) {

  }


  schoolinfo: ISchoolInfo;

  mTeacherSub: ISimpleBar;

  /**旭日图 性别比例 */
  SexRateSunburstOption = CommonFunction.clone(SexRateSunburstOption);

  SexRateChart: echartsInstance;
  SexRateChartInit(chart: echartsInstance) {
    this.SexRateChart = chart;
  }

  SaveSexRateImage() {
    CommonFunction.SaveChartImage(this.SexRateChart, "全校性别比例");
  }

  ngOnInit(): void {

    this.route.data
      .subscribe((data: { schoolInfo: ISchoolInfo }) => {
        this.schoolinfo = data.schoolInfo;
        this.service.SchoolOverview = this.schoolinfo;

        //旭日图
        this.SexRateSunburstOption.title.text = "全校男女性别比例";
        this.SexRateSunburstOption.title['show'] = false;
        this.SexRateSunburstOption.series.data[0].value = data.schoolInfo.total.property.sexRate.posCnt + data.schoolInfo.total.property.sexRate.negCnt;

        this.SexRateSunburstOption.series.data[0].children[0].value = data.schoolInfo.total.grade1SexRate.posCnt + data.schoolInfo.total.grade1SexRate.negCnt;
        this.SexRateSunburstOption.series.data[0].children[0].children[0].value = data.schoolInfo.total.grade1SexRate.posCnt;
        this.SexRateSunburstOption.series.data[0].children[0].children[1].value = data.schoolInfo.total.grade1SexRate.negCnt;

        this.SexRateSunburstOption.series.data[0].children[1].value = data.schoolInfo.total.grade2SexRate.posCnt + data.schoolInfo.total.grade2SexRate.negCnt;
        this.SexRateSunburstOption.series.data[0].children[1].children[0].value = data.schoolInfo.total.grade2SexRate.posCnt;
        this.SexRateSunburstOption.series.data[0].children[1].children[1].value = data.schoolInfo.total.grade2SexRate.negCnt;

        this.SexRateSunburstOption.series.data[0].children[2].value = data.schoolInfo.total.grade3SexRate.posCnt + data.schoolInfo.total.grade3SexRate.negCnt;
        this.SexRateSunburstOption.series.data[0].children[2].children[0].value = data.schoolInfo.total.grade3SexRate.posCnt;
        this.SexRateSunburstOption.series.data[0].children[2].children[1].value = data.schoolInfo.total.grade3SexRate.negCnt;


        let subnamelist = [];
        let subcnt = [];
        for (const key in this.schoolinfo.total.teacherSubCnt) {
          switch (key) {
            case "通用技术":
              subnamelist.push('技术'); //替换
              break;
            case "英语2":
              break;                    //不计算
            default:
              subnamelist.push(key);
              break;
          }
          if (key === "英语") {
            //英语和英语2一起计算
            subcnt.push(this.schoolinfo.total.teacherSubCnt['英语'] + this.schoolinfo.total.teacherSubCnt['英语2']);
          } else {
            if (key !== "英语2") subcnt.push(this.schoolinfo.total.teacherSubCnt[key]);
          }
        }

        this.mTeacherSub = {
          xAxis: {
            type: 'category',
            data: subnamelist
          },
          title: {
            text: '教师人数'
          },
          tooltip: {},
          yAxis: {
            type: 'value'
          },
          series: [{
            label: {
              normal: {
                show: true
              }
            },
            data: subcnt,
            type: 'bar'
          }]
        }
        this.mTeacherSub.title['show'] = false;
        this.mTeacherSub['toolbox'] = {
          'show': true,
          'feature': {
            'saveAsImage': {},
            'magicType': {
              'type': ['line', 'bar']
            }
          }
        };


      });
  }
  fullteacher() {
    this.router.navigate(['home/teacherfull']);
  }
  ShowCampus(campusname: string) {
    this.router.navigate(['home/campus', campusname]);
  }
}
