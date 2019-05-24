import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IStudent, ITeacher, IScore } from 'src/app/Home/Common/Education.model';
import { Router } from '@angular/router';
import { ToolboxSaveImageOnly } from '../../GraphOption/KaoqinOption';
import { CommonFunction } from '../../Common/common';

@Component({
    templateUrl: 'Grade3Score.html',
})
export class Grade3ScoreComponent implements OnInit {
    constructor(
        private router: Router,
        public service: HomeService
    ) {

    }
    public CurrentStudent: IStudent;
    public Teachers: ITeacher[];
    public Scores: IScore[];

    public subNameList = ['语文', '数学', '英语'];
    public LineGraphOption:
        {
            xAxis: { type: string, data: any[] },
            yAxis: { type: string },
            series: { data: any[], type: string }[]
        }[] = [];


    ngOnInit(): void {
        if (this.service.CurrentStudentInfo === undefined) {
            this.router.navigate(['home/school']);
        }
        //成绩列表
        this.CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
        this.Teachers = this.service.CurrentStudentInfo.teachers;
        this.Scores = this.service.CurrentStudentInfo.chengjis.filter(x => x.subId !== "99"); //99表示总分

        if (this.CurrentStudent.optionCourse.length == 3) {
            this.subNameList.push(this.CurrentStudent.optionCourse[0]);
            this.subNameList.push(this.CurrentStudent.optionCourse[1]);
            this.subNameList.push(this.CurrentStudent.optionCourse[2]);
        } else {
            this.subNameList.push('历史', '政治', '生物', '物理', '化学', '地理');
        }

        //按照考试科目进行分组     
        //语数外
        //历史政治生物 
        //化学物理地理
        this.subNameList.forEach(
            subname => {
                let opt = {
                    title: { text: subname },
                    toolbox: ToolboxSaveImageOnly,
                    tooltip: {},
                    legend: {
                        right: 50,
                        data: ['年级百分比', '等第']
                    },
                    xAxis: { type: 'category', data: [], axisLabel: { interval: 0 } },
                    yAxis: { type: 'value' },
                    series: [
                        { data: [], type: 'line', name: '年级百分比' },
                        { data: [], type: 'line', name: '等第' }
                    ]
                };
                let scoreAvalible = this.Scores.filter(
                    x => x.subName == subname && x.score > 0 &&
                        (x.type === "2" || x.type === "3" || x.type === "6" || x.type === "7"));
                opt.xAxis.data = scoreAvalible.map(_ => "");
                opt.xAxis.data.push("预测")
                opt.series[0].data = scoreAvalible.map(x => CommonFunction.roundvalue(-x.gradeRankPercent));
                opt.series[0].data.push(CommonFunction.pred(opt.series[0].data));
                opt.series[1].data = scoreAvalible.filter(x => x.dengdi.toString() !== "").map(x => CommonFunction.roundvalue(-x.dengdi * 100));
                opt.series[1].data.push(CommonFunction.pred(opt.series[1].data));
                //等第可能是空
                this.LineGraphOption.push(opt);

            }
        )

    }
    JumpToTeacher(teacherid: string) {
        this.router.navigate(['teacher/overview', teacherid]);
    }
};  