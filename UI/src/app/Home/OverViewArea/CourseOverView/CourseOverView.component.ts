import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'src/app/Home/Common/Education.model';
import { CommonFunction } from '../../Common/common'
import {
  CourseSelectCntOption, CourseSelectTwoCntOption, CourseSelectThreeCntOption,
  CourseSelectRadarGraphOption, SelectCourseSankeyOption
} from '../../GraphOption/ScoreOption'

@Component({
  templateUrl: 'CourseOverView.html',
})
export class CourseOverViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  //单科图
  mCourseSelectRadarGraphOption = CourseSelectRadarGraphOption;
  mCourseSelectCntOption = CourseSelectCntOption;
  SingleCoursePercent: { name: string, value: number }[];

  //两门课程
  mCourseSelectTwoCntOption = CommonFunction.clone(CourseSelectTwoCntOption);
  mCourseSelectTwoPercentOption = CommonFunction.clone(CourseSelectTwoCntOption);

  //三门课程
  ThreeCoursePercent: { name: string, value: number }[];
  mCourseSelectThreeCntOption =  CommonFunction.clone(CourseSelectThreeCntOption);
  //桑吉图
  mSelectCourseSankeyOption = CommonFunction.clone(SelectCourseSankeyOption);


  ngOnInit(): void {
    this.route.data
      .subscribe((data: { courseInfo: ICourse }) => {
        data.courseInfo.selectionCourseCnt.sort((x, y) => { return y.value - x.value; });
        this.mCourseSelectCntOption.xAxis.data = data.courseInfo.selectionCourseCnt.map(x => x.name);
        this.mCourseSelectCntOption.series[0].data = data.courseInfo.selectionCourseCnt.map(x => x.value);
        this.SingleCoursePercent = data.courseInfo.selectionCourseCnt.map(x => {
          return { 'name': x.name, 'value': CommonFunction.roundvalue(x.value * 100 / data.courseInfo.studentCnt) }
        });
        console.log(this.SingleCoursePercent);
        this.mCourseSelectRadarGraphOption.radar.indicator =
          data.courseInfo.selectionCourseCnt.map(x => { return { 'name': x.name, 'max': data.courseInfo.studentCnt } });
        this.mCourseSelectRadarGraphOption.series[0].data[0].value = data.courseInfo.selectionCourseCnt.map(x => x.value);
        //两门课程
        var Course1 = ['地理', '化学', '技术', '历史', '生物', '物理'];
        var Course2 = ['化学', '技术', '历史', '生物', '物理', '政治'];
        this.mCourseSelectTwoCntOption.xAxis.data = Course1;
        this.mCourseSelectTwoCntOption.yAxis.data = Course2;
        this.mCourseSelectTwoPercentOption.xAxis.data = Course1;
        this.mCourseSelectTwoPercentOption.yAxis.data = Course2;

        let CombineData = [];
        let CombineDataPercent = [];

        for (let index = 0; index < 6; index++) {
          for (let index2 = 0; index2 < 6; index2++) {
            let c1 = Course1[index];
            let c2 = Course2[index2];
            let key = c1 + '/' + c2;
            let combine = data.courseInfo.selectionTwoCourseCnt.find(x => x.name == key)
            if (combine === undefined) {
              CombineData.push([index, index2, "-"]);
              CombineDataPercent.push([index, index2, "-"]);
            } else {
              CombineData.push([index, index2, combine.value]);
              CombineDataPercent.push([index, index2, CommonFunction.roundvalue(combine.value * 100 / data.courseInfo.studentCnt)]);
            }
          }
        }
        this.mCourseSelectTwoCntOption.series[0].data = CombineData;
        this.mCourseSelectTwoPercentOption.title.text = "高考七选三（两门百分比）"
        this.mCourseSelectTwoPercentOption.visualMap.max = 50;
        this.mCourseSelectTwoPercentOption.series[0].data = CombineDataPercent;

        //三门课程
        data.courseInfo.selectionThreeCourseCnt.sort((x, y) => { return y.value - x.value; });
        this.mCourseSelectThreeCntOption.xAxis.data = data.courseInfo.selectionThreeCourseCnt.map(x => x.name);
        this.mCourseSelectThreeCntOption.series[0].data = data.courseInfo.selectionThreeCourseCnt.map(x => x.value);
        this.ThreeCoursePercent = data.courseInfo.selectionThreeCourseCnt.map(x => {
          return { 'name': x.name, 'value': CommonFunction.roundvalue(x.value * 100 / data.courseInfo.studentCnt) }
        });
        //桑基图
        //注意：重复数据会导致桑基图出现错误
        this.mSelectCourseSankeyOption.series.data = [];
        this.mSelectCourseSankeyOption.series.links = [];
        data.courseInfo.selectionCourseCnt.map(x => { return { 'name': x.name } }).forEach(element => {
          this.mSelectCourseSankeyOption.series.data.push(element);
        });
        data.courseInfo.selectionTwoCourseCnt.map(x => { return { 'name': x.name } }).forEach(element => {
          this.mSelectCourseSankeyOption.series.data.push(element);
        });
        data.courseInfo.selectionThreeCourseCnt.map(x => { return { 'name': x.name } }).forEach(element => {
          this.mSelectCourseSankeyOption.series.data.push(element);
        });
        console.log(this.mSelectCourseSankeyOption.series.data);
        //第一层Link
        data.courseInfo.selectionCourseCnt.map(x => x.name).forEach(
          one => {
            data.courseInfo.selectionTwoCourseCnt.forEach(
              two => {
                if (two.name.indexOf(one) !== -1) {
                  this.mSelectCourseSankeyOption.series.links.push({ 'source': one, 'target': two.name, 'value': two.value });
                }
              }
            )
          }
        )

        //第二层Link
        data.courseInfo.selectionTwoCourseCnt.map(x => x.name).forEach(
          two => {
            data.courseInfo.selectionThreeCourseCnt.forEach(
              three => {
                let first = two.split("/")[0];
                let second = two.split("/")[1];
                if (three.name.indexOf(first) !== -1 && three.name.indexOf(second) !== -1) {
                  this.mSelectCourseSankeyOption.series.links.push({ 'source': two, 'target': three.name, 'value': three.value });
                }
              }
            )
          }
        )



        console.log(this.mSelectCourseSankeyOption.series.links);


      });
  }

}
