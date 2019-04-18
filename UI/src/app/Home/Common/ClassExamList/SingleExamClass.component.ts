import { Component, OnInit } from '@angular/core';
import { IScore, IClassExam } from 'src/app/Home/Common/Education.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../Home.service';
import { ScoreFunnelOption } from '../../GraphOption/ScoreOption';
import { CommonFunction } from '../common';

@Component({
    templateUrl: 'SingleExamClass.html',
})
export class SingleExamClassComponent implements OnInit {
    Scores: IScore[];
    CurrentClassExam: IClassExam;
    mScoreFunnelOption = CommonFunction.clone(ScoreFunnelOption);
    Title: string;
    subTitle: string;
    IsFunnel: boolean = false;
    ngOnInit(): void {
        this.route.data.subscribe((data: { singleExam: IScore[] }) => {
            this.Title = data.singleExam[0].numberName;
            this.subTitle = data.singleExam[0].className + " - " + data.singleExam[0].subName;
            this.Scores = data.singleExam;
            if (this.service.CurrentClassExam === undefined) {
                //在该页面刷新的话，会出现问题
                this.IsFunnel = false;
                return;
            }
            this.CurrentClassExam = this.service.CurrentClassExam;
            this.mScoreFunnelOption.legend.data = [];
            this.mScoreFunnelOption.series[0].data = [];
            let maxcnt = 0;
            for (let k in this.CurrentClassExam.funnelDic) {
                this.mScoreFunnelOption.legend.data.push(k);
                this.mScoreFunnelOption.series[0].data.push({ name: k, value: this.CurrentClassExam.funnelDic[k] });
                if (this.CurrentClassExam.funnelDic[k] > maxcnt) {
                    maxcnt = this.CurrentClassExam.funnelDic[k];
                }
            }
            this.mScoreFunnelOption.series[0].max = maxcnt;
            this.IsFunnel = true;
        });
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: HomeService
    ) { }

    onRowSelect(event: { data: IScore; }) {
        this.router.navigate(['student/overview', event.data.studentID]);
    }
}