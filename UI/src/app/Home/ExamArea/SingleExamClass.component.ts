import { Component, OnInit } from '@angular/core';
import { IScore, IClassExam } from 'src/app/Home/Common/Education.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../Common/Home.service';
import { ScoreFunnelOption } from '../GraphOption/ScoreOption';

@Component({
    templateUrl: 'SingleExamClass.html',
})
export class SingleExamClassComponent implements OnInit {
    Scores: IScore[];
    CurrentClassExam: IClassExam;
    mScoreFunnelOption = ScoreFunnelOption;

    ngOnInit(): void {
        this.route.data.subscribe((data: { singleExam: IScore[] }) => {
            this.Scores = data.singleExam;
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