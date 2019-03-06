import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Home.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScoreRadarGraphOption } from '../GraphOption/ScoreOption';

@Component({
    templateUrl: 'Grade1Score.html',
})
export class Grade1ScoreComponent implements OnInit {
    constructor(
        public studentSerice: HomeService,
        private router: Router,
        private route: ActivatedRoute
    ) {

    }

    ScoreGraphFor2Option = ScoreRadarGraphOption;
    ScoreGraphFor19Option = ScoreRadarGraphOption;

    ngOnInit(): void {
        //成绩列表
        let ScoreList = this.studentSerice.CurrentStudentInfo.chengjis;
        ScoreList.sort((x,y)=>{return x.subId.localeCompare(y.subId)});
        //初一学生：显示 #19 - 2018-2019新高一7月测试 雷达图
        //初一学生：显示 #2 - 2018-1学期期中考试 雷达图
        let Score2 = ScoreList.filter(x => x.type === "2")
        this.ScoreGraphFor2Option.title.text = '2018-1学期期中考试';
        this.ScoreGraphFor2Option.radar.indicator = Score2.map(x => { return { name: x.subName, 'max': 100 } });
        this.ScoreGraphFor2Option.series[0].data[0].value = Score2.map(x => (1 - x.dengdi) * 100);
        this.ScoreGraphFor2Option.series[0].data[1].value = Score2.map(x => x.tScore);
        this.ScoreGraphFor2Option = (JSON.parse(JSON.stringify(ScoreRadarGraphOption)));

        let Score19 = ScoreList.filter(x => x.type === "19")
        this.ScoreGraphFor19Option.title.text = '2018-2019新高一7月测试';
        this.ScoreGraphFor19Option.radar.indicator = Score19.map(x => { return { name: x.subName, 'max': 100 } });
        this.ScoreGraphFor19Option.series[0].data[0].value = Score19.map(x => (1 - x.dengdi) * 100);
        this.ScoreGraphFor19Option.series[0].data[1].value = Score19.map(x => x.tScore);
        this.ScoreGraphFor19Option = (JSON.parse(JSON.stringify(ScoreRadarGraphOption)));
    }

    /** 返回 */
    Return() {
        let id = this.route.snapshot.paramMap.get('id');
        this.router.navigate(['../../', id], { relativeTo: this.route });
    }
};  