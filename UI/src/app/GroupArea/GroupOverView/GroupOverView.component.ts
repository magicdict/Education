import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGroupInfo } from '../Group.model'
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: 'GroupOverView.html',
})
export class GroupOverViewComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { groupinfo: IGroupInfo }) => {
        //'整体', '高一', '高二', '高三'
        this.option.series[0].data = [-data.groupinfo.maleTotal, -data.groupinfo.maleGrade1, -data.groupinfo.maleGrade2, -data.groupinfo.maleGrade3];
        this.option.series[1].data = [data.groupinfo.femaleTotal, data.groupinfo.femaleGrade1, data.groupinfo.femaleGrade2, data.groupinfo.femaleGrade3];
      });
    this.http.get('assets/china.json')
      .subscribe(geoJson => {
        registerMap('China', geoJson);
      });
  }



  regionOptions = {
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
        data: [
          { name: '北京', value: 0 },
          { name: '天津', value: 0 },
          { name: '重庆', value: 0 },
          { name: '上海', value: 0 },
          { name: '湖南', value: 0 },
          { name: '广东', value: 20 },
          { name: '福建', value: 0 },
          { name: '江西', value: 0 },
          { name: '四川', value: 0 },
          { name: '广西', value: 0 },
          { name: '新疆', value: 0 },
          { name: '西藏', value: 0 },
          { name: '青海', value: 0 },
          { name: '甘肃', value: 0 },
          { name: '宁夏', value: 0 },
          { name: '内蒙古', value: 0 },
          { name: '海南', value: 0 },
          { name: '山西', value: 0 },
          { name: '陕西', value: 0 },
          { name: '云南', value: 0 },
          { name: '贵州', value: 0 },
          { name: '湖北', value: 0 },
          { name: '浙江', value: 0 },
          { name: '安徽', value: 0 },
          { name: '河南', value: 0 },
          { name: '山东', value: 0 },
          { name: '江苏', value: 0 },
          { name: '河北', value: 0 },
          { name: '辽宁', value: 0 },
          { name: '吉林', value: 0 },
          { name: '黑龙江', value: 0 },
          { name: '台湾', value: 0 }]
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
