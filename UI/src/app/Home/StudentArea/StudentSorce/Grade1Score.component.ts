import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ScoreRadarGraphOption } from '../../GraphOption/ScoreOption'
import { IStudent, ITeacher } from 'src/app/Home/Common/Education.model';
import { CommonFunction } from 'src/app/Home/Common/common';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'Grade1Score.html',
})
export class Grade1ScoreComponent implements OnInit {
    constructor(
        private router: Router,
        public service: HomeService
    ) {

    }
    public CurrentStudent: IStudent;
    public Teachers: ITeacher[];
    ScoreGraphFor2Option = ScoreRadarGraphOption;
    ScoreGraphFor19Option = ScoreRadarGraphOption;

    ngOnInit(): void {
        //成绩列表
        this.CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
        this.Teachers = this.service.CurrentStudentInfo.teachers;
        let ScoreList = this.service.CurrentStudentInfo.chengjis;
        ScoreList.sort((x, y) => { return x.subId.localeCompare(y.subId) });
        //初一学生：显示 #19 - 2018-2019新高一7月测试 雷达图
        //初一学生：显示 #2 - 2018-1学期期中考试 雷达图
        let Score2 = ScoreList.filter(x => x.type === "2")
        this.ScoreGraphFor2Option.title.text = '2018-1学期期中考试';
        this.ScoreGraphFor2Option.radar.indicator = Score2.map(x => { return { name: x.subName, 'max': 100 } });
        this.ScoreGraphFor2Option.series[0].data[0].value = Score2.map(x => CommonFunction.roundvalue((1 - x.dengdi) * 100));
        this.ScoreGraphFor2Option.series[0].data[1].value = Score2.map(x => CommonFunction.roundvalue(x.tScore));
        this.ScoreGraphFor2Option = (JSON.parse(JSON.stringify(ScoreRadarGraphOption)));

        let Score19 = ScoreList.filter(x => x.type === "19")
        this.ScoreGraphFor19Option.title.text = '2018-2019新高一7月测试';
        this.ScoreGraphFor19Option.radar.indicator = Score19.map(x => { return { name: x.subName, 'max': 100 } });
        this.ScoreGraphFor19Option.series[0].data[0].value = Score19.map(x => CommonFunction.roundvalue((1 - x.dengdi) * 100));
        this.ScoreGraphFor19Option.series[0].data[1].value = Score19.map(x => CommonFunction.roundvalue(x.tScore));
        this.ScoreGraphFor19Option = (JSON.parse(JSON.stringify(ScoreRadarGraphOption)));
    }
    JumpToTeacher(teacherid: string) {
        this.router.navigate(['teacher/overview', teacherid]);
    }
};  