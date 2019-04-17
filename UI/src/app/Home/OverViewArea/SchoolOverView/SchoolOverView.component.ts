import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchoolInfo } from '../../Common/Education.model';
import { regionMapOptions, SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { HomeService } from '../../Common/Home.service';
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

  IsMapReady = false;
  /**地图 */
  NativePlaceRegionOpt = CommonFunction.clone(regionMapOptions);
  /**旭日图 性别比例 */
  SexRateSunburstOption = SexRateSunburstOption;

  ngOnInit(): void {

    this.route.data
      .subscribe((data: { schoolInfo: ISchoolInfo }) => {
        this.schoolinfo = data.schoolInfo;
        this.service.SchoolOverview = this.schoolinfo;
        this.NativePlaceRegionOpt.title.text = "";
        this.NativePlaceRegionOpt.series[0].data = data.schoolInfo.total.property.nativePlace;

        //旭日图
        this.SexRateSunburstOption.title.text = "";
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
