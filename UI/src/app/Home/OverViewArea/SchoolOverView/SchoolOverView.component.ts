import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolInfo } from '../../Common/Education.model';
import { SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { HomeService } from '../../Common/Home.service';
import { echartsInstance } from 'echarts'
import { CommonFunction } from '../../Common/common';

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
        this.SexRateSunburstOption.series.data[0].value = data.schoolInfo.total.property.totalSexRate.maleCnt + data.schoolInfo.total.property.totalSexRate.femaleCnt;

        this.SexRateSunburstOption.series.data[0].children[0].value = data.schoolInfo.total.grade1SexRate.maleCnt + data.schoolInfo.total.grade1SexRate.femaleCnt;
        this.SexRateSunburstOption.series.data[0].children[0].children[0].value = data.schoolInfo.total.grade1SexRate.maleCnt;
        this.SexRateSunburstOption.series.data[0].children[0].children[1].value = data.schoolInfo.total.grade1SexRate.femaleCnt;

        this.SexRateSunburstOption.series.data[0].children[1].value = data.schoolInfo.total.grade2SexRate.maleCnt + data.schoolInfo.total.grade2SexRate.femaleCnt;
        this.SexRateSunburstOption.series.data[0].children[1].children[0].value = data.schoolInfo.total.grade2SexRate.maleCnt;
        this.SexRateSunburstOption.series.data[0].children[1].children[1].value = data.schoolInfo.total.grade2SexRate.femaleCnt;

        this.SexRateSunburstOption.series.data[0].children[2].value = data.schoolInfo.total.grade3SexRate.maleCnt + data.schoolInfo.total.grade3SexRate.femaleCnt;
        this.SexRateSunburstOption.series.data[0].children[2].children[0].value = data.schoolInfo.total.grade3SexRate.maleCnt;
        this.SexRateSunburstOption.series.data[0].children[2].children[1].value = data.schoolInfo.total.grade3SexRate.femaleCnt;

      });
  }

  ShowCampus(campusname: string) {
    this.router.navigate(['home/campus', campusname]);
  }
}
