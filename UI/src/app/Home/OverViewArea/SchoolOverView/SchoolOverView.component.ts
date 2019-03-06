import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IGroupInfo,IStudent,classopt } from '../../../Education.model';
import {  HomeService } from '../../Home.service';


@Component({
  templateUrl: 'SchoolOverView.html',
})
export class SchoolOverViewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public studentSerice: HomeService
  ) {

  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { groupinfo: IGroupInfo }) => {
        //'整体', '高一', '高二', '高三'
        this.option.series[0].data = [-data.groupinfo.maleTotal, -data.groupinfo.maleGrade1, -data.groupinfo.maleGrade2, -data.groupinfo.maleGrade3];
        this.option.series[1].data = [data.groupinfo.femaleTotal, data.groupinfo.femaleGrade1, data.groupinfo.femaleGrade2, data.groupinfo.femaleGrade3];
        this.regionOptions.series[0].data = data.groupinfo.geoOptions;
      });
  }

  public StudentId: string;
  public ClassId: string;
  public QueryResult: IStudent[];
  public classlist = classopt;

  QueryByStudentId() {
    this.studentSerice.QueryByStudentId(this.StudentId).then(
      r => {
        this.QueryResult = r;
        if (r.length === 1) {
          this.router.navigate(['../student/overview', r[0].id], { relativeTo: this.route });
        }
      }
    )
  }

  QueryByClassId() {
    this.studentSerice.QueryByClassId(this.ClassId).then(
      r => {
        this.QueryResult = r;
      }
    )
  }

 

  regionOptions = {
    title: {
      text: '生源地图',
      left: 10
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}：{c}'
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    visualMap: {
      min: 0,
      max: 50,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#ADCDEF', '#2171C1']
      }
    },
    series: [
      {
        type: 'map',
        mapType: 'China',
        itemStyle: {
          normal: {
            areaColor: '#AAD5FF',
            borderColor: 'white',
            label: { show: true, color: 'white' }
          },
          emphasis: {
            areaColor: '#A5DABB'
          }
        },
        zoom: 1.2,
        data: []
      }
    ]
  }

  option = {
    color: ['blue', 'red'],
    title: {
      text: '男女比例',
      left: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['男', '女']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value'
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['整体', '高一', '高二', '高三']
      }
    ],
    series: [
      {
        name: '男',
        type: 'bar',
        stack: '性别比例',
        label: {
          normal: {
            show: true
          }
        },
        data: []
      },
      {
        name: '女',
        type: 'bar',
        stack: '性别比例',
        label: {
          normal: {
            show: true
          }
        },
        data: []
      }
    ]
  };


}
