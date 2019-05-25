import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IExamList, IClassExam, IExamInfoForNumberAndSubName, IScore } from 'src/app/Home/Common/Education.model';
import { CommonFunction } from 'src/app/Home/Common/common';
import { HomeService } from '../../Common/Home.service';
import { ScoreFunnelOption, ScoreRadarGraphForClassOption } from '../../GraphOption/ScoreOption';
import { ISimpleBar, ToolboxForBar } from '../../GraphOption/KaoqinOption';
@Component({
    templateUrl: 'ExamOverView.html',
})
export class ExamOverViewComponent implements OnInit, AfterViewInit {

    Exams: IClassExam[] = [];
    TeacherExams: IClassExam[] = [];
    Top10: IScore[] = [];
    Low10: IScore[] = [];
    FootExam: IClassExam;

    Title: string;
    subTitle: string;
    SubName: string;

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
    SideSubNameList = [];
    SelectSideSubName = '';

    ExamChange() {
        let m = this.GradeExamList.find(x => x.name == this.SelectGrade).value;
        let n = m.find(x => x.number == this.SelectExamNumber);
        this.SelectExamName = n.numberName;
        this.SubNameList = n.subNameList;
        this.SideSubNameList = this.SubNameList.map(x => { return { 'label': x, 'value': x } });
        this.SelectSideSubName = n.subNameList[0];
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
            this.SideSubNameList = this.SubNameList.map(x => { return { 'label': x, 'value': x } });
            this.SelectSideSubName = this.SubName;
            this.SideSubNameChanged();
        } else {
            //默认
            this.SelectGrade = this.GradeExamList[0].name;
            this.GradeChange();
            this.SelectExamNumber = this.GradeExamList[0].value[0].number;
            this.SubNameList = this.GradeExamList[0].value[0].subNameList;
            this.SideSubNameList = this.SubNameList.map(x => { return { 'label': x, 'value': x } });
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
    FunnelechartsInstance: any;
    onFunnelChartInit(event: any) {
        this.FunnelechartsInstance = event;
    }
    mScoreFunnelOption = CommonFunction.clone(ScoreFunnelOption);

    SideCourseInstance: any;
    onSideCourseChartInit(event: any) {
        this.SideCourseInstance = event;
    }
    mSidePointCnt = 0;
    mSideCourseOption = {
        title: {
            text: '',
        },
        tooltip: {
            formatter:(items)=>{
                let rtn = this.SelectSubName + ":" + items.value[0] + "</br>";
                rtn += this.SelectSideSubName + ":" + items.value[1];                
                return rtn;
            }
        },
        xAxis: {
            type: 'value',
            name:'',
        },
        yAxis: {
            type: 'value',
            name:''
        },
        series: [{
            symbolSize: 20,
            data: [],
            itemStyle:{
                color:(items)=>{
                    let diff = Math.abs(items.value[0] - items.value[1]);
                    let stardart = this.mSidePointCnt / 2;
                    if (diff > stardart){
                        return "#c23531";
                    } else{
                        return "#2f4554";
                    }
                }
            },
            type: 'scatter'
        }]
    };


    RadarechartsInstance: any;
    onRadarChartInit(event: any) {
        this.RadarechartsInstance = event;
    }
    mScoreRadarOption = CommonFunction.clone(ScoreRadarGraphForClassOption);

    Top50ClassChartInstance: any;
    onTop50ClassChartInit(event: any) {
        this.Top50ClassChartInstance = event;
    }
    mTop50ClassOption: ISimpleBar = {
        toolbox: ToolboxForBar,
        tooltip: {},
        title: {
            text: 'TOP50各班级人数',
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                interval: 0,
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            label: {
                normal: {
                    show: true
                }
            },
            data: [],
            type: 'bar'
        }]
    };


    Top50ScatterChartInstance: any;
    onTop50ScatterChartInit(event: any) {
        this.Top50ScatterChartInstance = event;
    }
    mTop50ScatterOption = {
        title: {
            text: 'TOP50各班级排名分布情况',
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                interval: 0,
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            symbolSize: (dataItem: number[]) => {
                return dataItem[2] * 20;
            },
            data: [],
            type: 'scatter'
        }]
    };



    CreateEntity(r: IExamInfoForNumberAndSubName) {
        r.gradeInfo.record.className = "年级组";
        this.Exams = r.classExamInfoList;
        this.FootExam = r.gradeInfo;
        this.Top10 = r.top10;
        this.Low10 = r.low10;
        this.TeacherExams = r.teacherExamInfoList;
        this.Title = this.Exams[0].record.numberName;
        this.SubName = this.Exams[0].record.subName;
        this.subTitle = this.Exams[0].record.grade + " - " + this.Exams[0].record.subName;
        this.mScoreFunnelOption.legend.data = [];
        this.mScoreFunnelOption.series[0].data = [];
        this.mScoreFunnelOption.title.text = this.Title + this.subTitle + "分数段人数";
        this.mScoreFunnelOption.title.show = true;
        let maxcnt = 0;
        for (let k in r.gradeInfo.funnelDic) {
            this.mScoreFunnelOption.legend.data.push(k);
            this.mScoreFunnelOption.series[0].data.push({ name: k, value: r.gradeInfo.funnelDic[k] });
            if (r.gradeInfo.funnelDic[k] > maxcnt) {
                maxcnt = r.gradeInfo.funnelDic[k];
            }
        }
        this.mScoreFunnelOption.series[0].max = maxcnt;
        this.mScoreFunnelOption.title.text = this.subTitle;
        if (this.FunnelechartsInstance !== undefined) {
            this.FunnelechartsInstance.setOption(this.mScoreFunnelOption);
        }

        this.mScoreRadarOption.legend.data = ["最高分", "最低分", "平均分"]
        let High = [];
        let Low = [];
        let Avg = [];
        let ClassName = [];
        let MaxIndicator = 0;
        this.Exams.forEach(
            exam => {
                if (exam.maxScore > MaxIndicator) MaxIndicator = exam.maxScore;
            }
        );
        this.Exams.forEach(
            exam => {
                if (exam.record.className.indexOf("IB") === -1 && exam.record.className.indexOf("未分班") === -1) {
                    High.push(exam.maxScore);
                    Low.push(exam.minScore);
                    Avg.push(exam.avgScore);
                    ClassName.push({ name: exam.record.className, max: MaxIndicator })
                }
            }
        );

        this.mScoreRadarOption.title.text = this.subTitle + "各班成绩"
        this.mScoreRadarOption.series[0].data[0].value = High;
        this.mScoreRadarOption.series[0].data[1].value = Low;
        this.mScoreRadarOption.series[0].data[2].value = Avg;
        this.mScoreRadarOption.radar.indicator = ClassName;

        if (this.RadarechartsInstance !== undefined) {
            this.RadarechartsInstance.setOption(this.mScoreRadarOption);
        }

        this.mTop50ClassOption.xAxis.data = r.top50ForClassName.map(x => x.name);
        this.mTop50ClassOption.series[0].data = r.top50ForClassName.map(x => x.value);
        if (this.Top50ClassChartInstance !== undefined) {
            try {
                this.Top50ClassChartInstance.setOption(this.mTop50ClassOption);
            } catch (error) {

            }

        }

        let SeriesData = r.top50.map(x => [x.className, x.gradeRank, 1]);
        SeriesData.forEach(
            e => {
                let x = 0;
                SeriesData.forEach(
                    e2 => {
                        if (e2[0] === e[0] && e2[1] === e[1]) x++;
                    }
                )
                e[2] = x;
            }
        )

        this.mTop50ScatterOption.xAxis.data = this.mTop50ClassOption.xAxis.data;
        this.mTop50ScatterOption.series[0].data = SeriesData;
        if (this.Top50ScatterChartInstance !== undefined) {
            try {
                this.Top50ScatterChartInstance.setOption(this.mTop50ScatterOption);
            } catch (error) {

            }
        }
    }

    JumpToExam(number: string, subName: string, Grade: string) {
        var request = "course/GetExamInfoByNumberAndSubName?number=" + number + "&subName=" + escape(subName) + "&Grade=" + escape(Grade);
        this.SelectSubName = subName;
        this.SelectSideSubName = subName;
        this.commonFunction.httpRequest<IExamInfoForNumberAndSubName>(request).then(
            r => {
                this.service.CurrentExam = r;
                this.CreateEntity(r);
                this.SideSubNameChanged();
            }
        );
    }

    //偏科选择切换
    SideSubNameChanged() {
        var request = "course/GetGradeRankInfo?number=" + this.SelectExamNumber + "&subName1=" + escape(this.SelectSubName) + 
        "&subName2=" + escape(this.SelectSideSubName) + "&Grade=" + escape(this.SelectGrade);
        this.commonFunction.httpRequest<[][]>(request).then(
            r => {
                this.mSideCourseOption.xAxis.name = this.SelectSubName;
                this.mSideCourseOption.yAxis.name = this.SelectSideSubName;
                this.mSidePointCnt = r.length;
                this.mSideCourseOption.series[0].data = r;
                if (this.SideCourseInstance !== undefined) {
                    this.SideCourseInstance.setOption(this.mSideCourseOption);
                }
            }
        );
    }

    JumpToTeacher(event: { data: IClassExam }) {
        this.router.navigate(['teacher/overview', event.data.record.teacherID]);
    }

} 