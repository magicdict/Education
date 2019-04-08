import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolInfo } from '../../Common/Education.model';
import { SchoolSexBarOption, regionMapOptions, SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { SexRatePieOption } from '../../GraphOption/StudentGraphOption'
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../Common/Home.service';
import { CampusComponent } from './Campus.component';

@Component({
  templateUrl: 'SchoolOverView.html',
})
export class SchoolOverViewComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private service: HomeService
  ) {

  }


  schoolinfo: ISchoolInfo;

  IsMapReady = false;
  /**地图 */
  NativePlaceRegionOpt = regionMapOptions;
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
        this.service.SchoolOverview = this.schoolinfo;
        this.NativePlaceRegionOpt.title.text = "";
        this.NativePlaceRegionOpt.series[0].data = data.schoolInfo.total.geoOptions;

        //旭日图
        this.SexRateSunburstOption.title.text = "";
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


  @ViewChild('baiyang')
  private baiyangcampus: CampusComponent;

  @ViewChild('dongbu')
  private dongbucampus: CampusComponent;

  ShwoCampus(campusname: string) {
    //获得校区信息
    if (campusname === '白') {
      this.baiyangcampus.campusname = campusname;
      this.baiyangcampus.show();
    } else {
      this.dongbucampus.campusname = campusname;
      this.dongbucampus.show();
    }
  }
}
