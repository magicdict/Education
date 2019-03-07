import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent, IClassInfo } from 'src/app/Education.model';
import { HomeService } from '../../Home.service';
import { SexRate,regionOptions } from '../../GraphOption/StudentGraphOption'
@Component({
  templateUrl: 'ClassOverview.html',
}) 
export class ClassOverviewComponent implements OnInit {
  ngOnInit(): void {
    this.QueryResult = this.studentSerice.CurrentClassInfo;
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
    public studentSerice: HomeService
  ) { }

  public QueryResult: IStudent[];
  mSexRate = SexRate;
  NativePlaceRegionOptions = regionOptions;

  onRowSelect(event: { data: IStudent; }) {
    this.router.navigate(['student/overview', event.data.id]);
  }

}