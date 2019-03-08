import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'src/app/Education.model';
import { CourseSelectCntOption, CourseSelectTwoOption as CourseSelectTwoCntOption, CourseSelectCombineCntOption as CourseSelectThreeCntOption } from '../../GraphOption/ScoreOption'

@Component({
  templateUrl: 'CourseOverView.html',
})
export class CourseOverViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  mCourseSelectCntOption = CourseSelectCntOption;
  mCourseSelectTwoCntOption = CourseSelectTwoCntOption;
  mCourseSelectThreeCntOption = CourseSelectThreeCntOption;
  ngOnInit(): void {
    this.route.data
      .subscribe((data: { courseInfo: ICourse }) => {
        data.courseInfo.selectionCourseCnt.sort((x, y) => { return y.value - x.value; });
        this.mCourseSelectCntOption.xAxis.data = data.courseInfo.selectionCourseCnt.map(x => x.name);
        this.mCourseSelectCntOption.series[0].data = data.courseInfo.selectionCourseCnt.map(x => x.value);

        var Course1 = ['地理','化学', '技术', '历史', '生物', '物理'];
        var Course2 = ['化学', '技术', '历史', '生物', '物理', '政治'];
        this.mCourseSelectTwoCntOption.xAxis.data = Course1;
        this.mCourseSelectTwoCntOption.yAxis.data = Course2;

        var CombineData = [];

        for (let index = 0; index < 6; index++) {
          for (let index2 = 0; index2 < 6; index2++) {
            let c1 = Course1[index];
            let c2 = Course2[index2];
            let key = c1 + '/' + c2;
            let combine = data.courseInfo.selectionTwoCourseCnt.find(x => x.name == key)
            if (combine === undefined) {
              CombineData.push([index, index2, "-"]);
            }else{
              CombineData.push([index, index2, combine.value]);
            }
          }
        }
        this.mCourseSelectTwoCntOption.series[0].data = CombineData;

        data.courseInfo.selectionThreeCourseCnt.sort((x, y) => { return y.value - x.value; });
        this.mCourseSelectThreeCntOption.xAxis.data = data.courseInfo.selectionThreeCourseCnt.map(x => x.name);
        this.mCourseSelectThreeCntOption.series[0].data = data.courseInfo.selectionThreeCourseCnt.map(x => x.value);
      });
  }

}
