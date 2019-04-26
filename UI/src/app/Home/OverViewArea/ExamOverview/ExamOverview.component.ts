import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IExamList, IClassExam, IExamInfoForNumberAndSubName, IScore } from 'src/app/Home/Common/Education.model';
import { CommonFunction } from 'src/app/Home/Common/common';
import { HomeService } from '../../Common/Home.service';
import { ScoreFunnelOption } from '../../GraphOption/ScoreOption';
@Component({
    templateUrl: 'ExamOverView.html',
})
export class ExamOverViewComponent implements OnInit, AfterViewInit {

    Exams: IClassExam[] = [];
    TeacherExams: IClassExam[] = [];
    Top10: IScore[] = [];
    Low10: IScore[] = [];
    FootExam: IClassExam;
    mScoreFunnelOption = ScoreFunnelOption;
    Title: string;
    subTitle: string;

    Gradelist = [
        { label: '高一', value: '高一' },
        { label: '高二', value: '高二' },
        { label: '高三', value: '高三' }
    ]
    SelectGrade = '';

    Examlist = [];
    SelectExamNumber = '';
    SelectExamName = '';
    GradeChange() {
        let m = this.GradeExamList.find(x => x.name == this.SelectGrade).value;
        this.Examlist = m.map(x => { return { 'label': x.numberName, 'value': x.number } });
        this.SelectExamNumber = this.Examlist[0].value;
        this.SelectExamName = this.Examlist[0].label;
        this.ExamChange();
    }

    SubNameList: string[];
    SelectSubName = '';

    ExamChange() {
        let m = this.GradeExamList.find(x => x.name == this.SelectGrade).value;
        let n = m.find(x => x.number == this.SelectExamNumber);
        this.SelectExamName = n.numberName;
        this.SubNameList = n.subNameList;
        this.JumpToExam(this.SelectExamNumber, this.SubNameList[0], this.SelectGrade);
    }


    GradeExamList: {
        name: string,
        value: {
            grade: string,
            number: string,
            numberName: string,
            subNameList: string[]
        }[]
    }[] = [];
    ngOnInit(): void {
        this.route.data
            .subscribe((data: { examgradelist: IExamList }) => {
                this.GradeExamList = [];
                this.GradeExamList.push({ name: "高一", value: data.examgradelist["高一"] });
                this.GradeExamList.push({ name: "高二", value: data.examgradelist["高二"] });
                this.GradeExamList.push({ name: "高三", value: data.examgradelist["高三"] });
            });
        if (this.service.CurrentExam !== undefined) {
            //恢复上次浏览的考试
            this.CreateEntity(this.service.CurrentExam);
            this.SelectGrade = this.Exams[0].record.grade;
            let m = this.GradeExamList.find(x => x.name == this.SelectGrade).value;
            this.SelectExamNumber = this.Exams[0].record.number;
            let n = m.find(x => x.number == this.SelectExamNumber);
            this.SelectExamName = this.Exams[0].record.numberName;
            this.SelectSubName = this.Exams[0].record.subName;
            this.Examlist = m.map(x => { return { 'label': x.numberName, 'value': x.number } });
            this.SubNameList = n.subNameList;
        } else {
            //默认
            this.SelectGrade = this.GradeExamList[0].name;
            this.GradeChange();
            this.SelectExamNumber = this.GradeExamList[0].value[0].number;
            this.SubNameList = this.GradeExamList[0].value[0].subNameList;
            this.JumpToExam(this.GradeExamList[0].value[0].number,
                this.GradeExamList[0].value[0].subNameList[0], this.GradeExamList[0].name);
        }
    }
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private commonFunction: CommonFunction,
        public service: HomeService,
        private cd: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        //ExpressionChangedAfterItHasBeenCheckedError的对应
        //因为动态加载了Panel
        this.cd.detectChanges();
    }
    //ngx-echarts初始化，获得图表实例
    echartsInstance: any;
    onChartInit(event: any) {
        this.echartsInstance = event;
    }

    CreateEntity(r: IExamInfoForNumberAndSubName) {
        r.gradeInfo.record.className = "年级组";
        this.Exams = r.classExamInfoList;
        this.FootExam = r.gradeInfo;
        this.Top10 = r.top10;
        this.Low10 = r.low10;
        this.TeacherExams = r.teacherExamInfoList;
        this.Title = this.Exams[0].record.numberName;
        this.subTitle = this.Exams[0].record.grade + " - " + this.Exams[0].record.subName;
        this.mScoreFunnelOption.legend.data = [];
        this.mScoreFunnelOption.series[0].data = [];
        let maxcnt = 0;
        for (let k in r.gradeInfo.funnelDic) {
            this.mScoreFunnelOption.legend.data.push(k);
            this.mScoreFunnelOption.series[0].data.push({ name: k, value: r.gradeInfo.funnelDic[k] });
            if (r.gradeInfo.funnelDic[k] > maxcnt) {
                maxcnt = r.gradeInfo.funnelDic[k];
            }
        }
        this.mScoreFunnelOption.series[0].max = maxcnt;
        if (this.echartsInstance !== undefined) {
            this.echartsInstance.setOption(this.mScoreFunnelOption);
        }
    }

    JumpToExam(number: string, subName: string, Grade: string) {
        var request = "course/GetExamInfoByNumberAndSubName?number=" + number + "&subName=" + escape(subName) + "&Grade=" + escape(Grade);
        this.SelectSubName = subName;
        this.commonFunction.httpRequest<IExamInfoForNumberAndSubName>(request).then(
            r => {
                this.service.CurrentExam = r;
                this.CreateEntity(r);
            }
        );
    }

    JumpToTeacher(event: { data: IClassExam }) {
        this.router.navigate(['teacher/overview', event.data.record.teacherID]);
    }

} 