import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'src/app/Education.model';
import { CourseSelectCntOption, CourseSelectCombineCntOption } from '../../GraphOption/ScoreOption'

@Component({
  templateUrl: 'CourseOverView.html',
})
export class CourseOverViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  mCourseSelectCntOption = CourseSelectCntOption;
  mCourseSelectCombineCntOption = CourseSelectCombineCntOption;

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { courseInfo: ICourse }) => {
        data.courseInfo.selectionCourseCnt.sort((x, y) => { return y.value - x.value; });
        this.mCourseSelectCntOption.xAxis.data = data.courseInfo.selectionCourseCnt.map(x => x.name);
        this.mCourseSelectCntOption.series[0].data = data.courseInfo.selectionCourseCnt.map(x => x.value);

        data.courseInfo.selectionCourseCombineCnt.sort((x, y) => { return y.value - x.value; });
        //data.courseInfo.selectionCourseCombineCnt = data.courseInfo.selectionCourseCombineCnt.slice(0, 10);
        this.mCourseSelectCombineCntOption.xAxis.data = data.courseInfo.selectionCourseCombineCnt.map(x => x.name);
        this.mCourseSelectCombineCntOption.series[0].data = data.courseInfo.selectionCourseCombineCnt.map(x => x.value);
      });
  }

}
