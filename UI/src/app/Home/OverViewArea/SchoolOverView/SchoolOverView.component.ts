import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISchoolInfo } from '../../Common/Education.model';
import { SchoolSexBarOption, regionMapOptions, SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { SexRatePieOption } from '../../GraphOption/StudentGraphOption'
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: 'SchoolOverView.html',
})
export class SchoolOverViewComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {

  }


  schoolinfo: ISchoolInfo;

  IsMapReady = false;
  /**地图 */
  NativePlaceRegionOpt = regionMapOptions;
  /**柱状图 性别比例 */
  SchoolSexOpt = SchoolSexBarOption;
  /**饼图 性别比例 */
  schoolSexRateOpt = SexRatePieOption;
  /**旭日图 性别比例 */
  SexRateSunburstOption = SexRateSunburstOption;



  ngOnInit(): void {

    //最初的页面就执行地图注册的操作
    this.http.get('assets/china.json')
      .subscribe(geoJson => {
        registerMap('China', geoJson);
        this.IsMapReady = true;
      });

    this.route.data
      .subscribe((data: { schoolInfo: ISchoolInfo }) => {
        this.schoolinfo = data.schoolInfo;
        this.NativePlaceRegionOpt.series[0].data = data.schoolInfo.total.geoOptions;

        //旭日图
        this.SexRateSunburstOption.series.data[0].value = data.schoolInfo.total.totalSexRate.maleCnt + data.schoolInfo.total.totalSexRate.femaleCnt;

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
}
