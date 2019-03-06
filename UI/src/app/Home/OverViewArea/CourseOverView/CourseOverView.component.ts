import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'src/app/Education.model';


@Component({
  templateUrl: 'CourseOverView.html', 
})
export class CourseOverViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { courseInfo: ICourse }) => {
        data.courseInfo.selectionCourseCnt.sort((x, y) => { return y.value - x.value; });
        this.CourseSelectCntOption.xAxis.data = data.courseInfo.selectionCourseCnt.map(x => x.name);
        this.CourseSelectCntOption.series[0].data = data.courseInfo.selectionCourseCnt.map(x => x.value);

        data.courseInfo.selectionCourseCombineCnt.sort((x, y) => { return y.value - x.value; });
        //data.courseInfo.selectionCourseCombineCnt = data.courseInfo.selectionCourseCombineCnt.slice(0, 10);
        this.CourseSelectCombineCntOption.xAxis.data = data.courseInfo.selectionCourseCombineCnt.map(x => x.name);
        this.CourseSelectCombineCntOption.series[0].data = data.courseInfo.selectionCourseCombineCnt.map(x => x.value);
      });
  }


  CourseSelectCntOption = {
    title: {
      text: '高考七选三(单科)',
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        label: {
          normal: {
            show: true,
            formatter: '{b}\n{c}'
          }
        },
        data: [],
        type: 'bar'
      }
    ]
  };

  CourseSelectCombineCntOption = {
    title: {
      text: '高考七选三（组合）',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: '{b}\n{c}'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        label: {
          normal: {
            show: true
          }
        },
        data: [],
        type: 'bar'
      }
    ]
  };
}
