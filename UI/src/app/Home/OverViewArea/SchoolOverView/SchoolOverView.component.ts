import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGroupInfo } from '../../../Education.model';
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


  schoolinfo: IGroupInfo;

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
      .subscribe((data: { groupinfo: IGroupInfo }) => {
        this.schoolinfo = data.groupinfo;
        this.NativePlaceRegionOpt.series[0].data = data.groupinfo.geoOptions;

        //柱状图 '整体', '高一', '高二', '高三'
        this.SchoolSexOpt.series[0].data = [-data.groupinfo.maleTotal, -data.groupinfo.maleGrade1, -data.groupinfo.maleGrade2, -data.groupinfo.maleGrade3];
        this.SchoolSexOpt.series[1].data = [data.groupinfo.femaleTotal, data.groupinfo.femaleGrade1, data.groupinfo.femaleGrade2, data.groupinfo.femaleGrade3];
        //饼图
        this.schoolSexRateOpt.title.text = "全校整体男女学生比例"
        this.schoolSexRateOpt.series[0].data[0].value = data.groupinfo.maleTotal;
        this.schoolSexRateOpt.series[0].data[1].value = data.groupinfo.femaleTotal;

        //旭日图
        this.SexRateSunburstOption.series.data[0].value = data.groupinfo.maleTotal + data.groupinfo.femaleTotal;

        this.SexRateSunburstOption.series.data[0].children[0].value = data.groupinfo.maleGrade1 + data.groupinfo.femaleGrade1;
        this.SexRateSunburstOption.series.data[0].children[0].children[0].value = data.groupinfo.maleGrade1;
        this.SexRateSunburstOption.series.data[0].children[0].children[1].value = data.groupinfo.femaleGrade1;

        this.SexRateSunburstOption.series.data[0].children[1].value = data.groupinfo.maleGrade2 + data.groupinfo.femaleGrade2;
        this.SexRateSunburstOption.series.data[0].children[1].children[0].value = data.groupinfo.maleGrade2;
        this.SexRateSunburstOption.series.data[0].children[1].children[1].value = data.groupinfo.femaleGrade2;

        this.SexRateSunburstOption.series.data[0].children[2].value = data.groupinfo.maleGrade3 + data.groupinfo.femaleGrade3;
        this.SexRateSunburstOption.series.data[0].children[2].children[0].value = data.groupinfo.maleGrade3;
        this.SexRateSunburstOption.series.data[0].children[2].children[1].value = data.groupinfo.femaleGrade3;



      });
  }
}
