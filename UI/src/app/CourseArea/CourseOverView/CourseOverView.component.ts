import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from '../Course.model'

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
        this.CourseSelectCntOption.xAxis.data = data.courseInfo.selectionCourseCnt.map(x => x.name);
        this.CourseSelectCntOption.series[0].data = data.courseInfo.selectionCourseCnt.map(x => x.value);
      });
  }


  CourseSelectCntOption = {
    title: {
      text: '高考七选三',
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
