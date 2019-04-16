import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IExamList, IClassExam, IExamInfoForNumberAndSubName, IScore } from 'src/app/Home/Common/Education.model';
import { CommonFunction } from 'src/app/Home/Common/common';
import { HomeService } from '../../Common/Home.service';
import { ScoreFunnelOption } from '../../GraphOption/ScoreOption';
@Component({
    templateUrl: 'ExamOverView.html',
})
export class ExamOverViewComponent implements OnInit, AfterViewInit {

    Exams: IClassExam[] = [];
    Top10: IScore[] = [];
    Low10: IScore[] = [];
    FootExam: IClassExam;
    mScoreFunnelOption = ScoreFunnelOption;
    Title: string;
    subTitle: string;

    GradeList: {
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
                this.GradeList = [];
                this.GradeList.push({ name: "高一", value: data.examgradelist["高一"] });
                this.GradeList.push({ name: "高二", value: data.examgradelist["高二"] });
                this.GradeList.push({ name: "高三", value: data.examgradelist["高三"] });
            });
        if (this.service.CurrentExam !== undefined) {
            //恢复上次浏览的考试
            this.CreateEntity(this.service.CurrentExam);
        }else{
            //默认
            this.JumpToExam(this.GradeList[0].value[0].number,
                            this.GradeList[0].value[0].subNameList[0],this.GradeList[0].name);
        }
    }
    constructor(
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
        var request = "course/GetExamInfoByNumberAndSubName?number=" + number + "&subName=" + subName + "&Grade=" + Grade;
        this.commonFunction.httpRequest<IExamInfoForNumberAndSubName>(request).then(
            r => {
                this.service.CurrentExam = r;
                this.CreateEntity(r);
            }
        );
    }
} 