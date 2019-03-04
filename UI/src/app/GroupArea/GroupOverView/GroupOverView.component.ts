import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IGroupInfo } from '../Group.model'

@Component({
  templateUrl: 'GroupOverView.html',
})
export class GroupOverViewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { groupinfo: IGroupInfo }) => {
        //'整体', '高一', '高二', '高三'
        this.option.series[0].data = [-data.groupinfo.maleTotal, -data.groupinfo.maleGrade1, -data.groupinfo.maleGrade2, -data.groupinfo.maleGrade3];
        this.option.series[1].data = [data.groupinfo.femaleTotal, data.groupinfo.femaleGrade1, data.groupinfo.femaleGrade2, data.groupinfo.femaleGrade3];
      })
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
