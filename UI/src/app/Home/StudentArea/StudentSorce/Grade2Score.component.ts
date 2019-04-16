import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IStudent, ITeacher, IScore } from 'src/app/Home/Common/Education.model';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'Grade2Score.html',
})
export class Grade2ScoreComponent implements OnInit {
    constructor(
        private router: Router,
        public service: HomeService
    ) {

    }
    public CurrentStudent: IStudent;
    public Teachers: ITeacher[];
    public Scores: IScore[];

    public subNameList = ['语文', '数学', '英语', '历史', '政治', '生物', '物理', '化学', '地理'];
    public LineGraphOption:
        {
            xAxis: { type: string, data: any[] },
            yAxis: { type: string },
            series: { data: any[], type: string }[]
        }[] = [];

    ngOnInit(): void {
        //成绩列表
        this.CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
        this.Teachers = this.service.CurrentStudentInfo.teachers;
        this.Scores = this.service.CurrentStudentInfo.chengjis.filter(x => x.subId !== "99");   //99表示总分
        //按照考试科目进行分组
        //语数外
        //历史政治生物 
        //化学物理地理
        this.subNameList.forEach(
            subname => {
                let opt = {
                    title: { text: subname },
                    legend: {
                        right: 10,
                        data: ['年级百分比', '等第']
                      },
                    xAxis: { type: 'category', data: [] },
                    yAxis: { type: 'value' },
                    series: [
                        { data: [], type: 'line',name: '年级百分比' },
                        { data: [], type: 'line',name: '等第' }
                    ]
                };
                let scoreAvalible = this.Scores.filter(
                    x => x.subName == subname && x.score > 0 && 
                    (x.type === "2" || x.type === "3" || x.type === "6" || x.type === "7"));
                opt.xAxis.data = scoreAvalible.map(x => "");
                opt.series[0].data = scoreAvalible.map(x => -x.gradeRankPercent);
                opt.series[1].data = scoreAvalible.filter(x => x.dengdi.toString() !== "").map(x => -x.dengdi * 100);
                //等第可能是空
                this.LineGraphOption.push(opt);
            }
        )

    }
    JumpToTeacher(teacherid: string) {
        this.router.navigate(['teacher/overview', teacherid]);
    }
};  