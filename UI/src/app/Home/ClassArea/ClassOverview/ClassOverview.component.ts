import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent, IClassInfo } from 'src/app/Education.model';
import { HomeService } from '../../Home.service';
import { SexRateOption,regionOptions } from '../../GraphOption/StudentGraphOption'
import { Location } from '@angular/common';

@Component({
  templateUrl: 'ClassOverview.html',
}) 
export class ClassOverviewComponent implements OnInit {
  ngOnInit(): void {
    this.QueryResult = this.service.CurrentClassInfo;
    this.route.data
      .subscribe((data: { classinfo: IClassInfo }) => {
        this.mSexRate.series[0].data[0].value = data.classinfo.maleCnt;
        this.mSexRate.series[0].data[1].value = data.classinfo.femaleCnt;
        this.NativePlaceRegionOptions.series[0].data = data.classinfo.geoOptions;
      });
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public service: HomeService,
    private _location: Location,

  ) { }

  public QueryResult: IStudent[];
  mSexRate = SexRateOption;
  NativePlaceRegionOptions = regionOptions;

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }
  Return() {
    this._location.back();
  }
  Home(){
    this.router.navigate(['']);
  }
}
