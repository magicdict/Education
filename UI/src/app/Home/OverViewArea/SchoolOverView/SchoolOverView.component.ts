import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IGroupInfo, IStudent, classopt } from '../../../Education.model';
import { HomeService } from '../../Home.service';
import { SchoolSexOption, regionOptions } from '../../GraphOption/StudentGraphOption';
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: 'SchoolOverView.html',
})
export class SchoolOverViewComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public service: HomeService
  ) {

  }

  IsMapReady = false;
  sexOption = SchoolSexOption;
  NativePlaceRegionOptions = regionOptions;

  ngOnInit(): void {

    //最初的页面就执行地图注册的操作
    this.http.get('assets/china.json')
      .subscribe(geoJson => {
        registerMap('China', geoJson);
        this.IsMapReady = true;
      });

    this.route.data
      .subscribe((data: { groupinfo: IGroupInfo }) => {
        //'整体', '高一', '高二', '高三'
        this.sexOption.series[0].data = [-data.groupinfo.maleTotal, -data.groupinfo.maleGrade1, -data.groupinfo.maleGrade2, -data.groupinfo.maleGrade3];
        this.sexOption.series[1].data = [data.groupinfo.femaleTotal, data.groupinfo.femaleGrade1, data.groupinfo.femaleGrade2, data.groupinfo.femaleGrade3];
        this.NativePlaceRegionOptions.series[0].data = data.groupinfo.geoOptions;
      });
  }
}
