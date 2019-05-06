import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ScoreRadarGraphOption } from '../../GraphOption/ScoreOption'
import { IStudent, ITeacher, IScore } from 'src/app/Home/Common/Education.model';
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
    public Scores: IScore[];
    ScoreGraphFor2Option = CommonFunction.clone(ScoreRadarGraphOption);
    IsShowType2: boolean = true;

    ngOnInit(): void {
        //成绩列表
        if (this.service.CurrentStudentInfo === undefined) {
            this.router.navigate(['home/school']);
        }
        this.CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
        this.Teachers = this.service.CurrentStudentInfo.teachers;
        this.Scores = this.service.CurrentStudentInfo.chengjis.filter(x => x.subId !== "99"); //99表示总分

        let ScoreList = this.service.CurrentStudentInfo.chengjis.filter(x => x.subId !== "99"); //99表示总分
        ScoreList.sort((x, y) => { return x.subId.localeCompare(y.subId) });
        //初一学生：显示 #2 - 2018-1学期期中考试 雷达图
        let Score2 = ScoreList.filter(x => x.type === "2")
        if (Score2.length === 0) this.IsShowType2 = false;
        this.ScoreGraphFor2Option.title.text = '期中考试';
        this.ScoreGraphFor2Option.radar.indicator = Score2.map(x => { return { name: x.subName, 'max': 100 } });
        this.ScoreGraphFor2Option.series[0].data[0].value = Score2.map(x => CommonFunction.roundvalue((1 - x.dengdi) * 100));
        this.ScoreGraphFor2Option.series[0].data[1].value = Score2.map(x => CommonFunction.roundvalue(x.tScore));

    }
    JumpToTeacher(teacherid: string) {
        this.router.navigate(['teacher/overview', teacherid]);
    }
};  