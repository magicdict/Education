import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ICampus } from '../../Common/Education.model';
import { SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { CommonFunction } from '../../Common/common';
import { ISimpleBar } from '../../GraphOption/KaoqinOption';
import { ActivatedRoute } from '@angular/router';
import { echartsInstance } from 'echarts'
import { SexRateChartOption } from '../../GraphOption/SexRateChart';

@Component({
    selector: "campus",
    templateUrl: 'Campus.html',
})
export class CampusComponent implements OnInit {

    display = false;

    campusfullname: string;

    campusname: string;

    campusInfo: ICampus;
    /**性别饼图 */
    mSexRateOption = CommonFunction.clone(SexRateChartOption);
    /**旭日图 性别比例 */
    mSexRateSunburstOption = CommonFunction.clone(SexRateSunburstOption);

    SexRateChart: echartsInstance;
    SexRateChartInit(chart: echartsInstance) {
        this.SexRateChart = chart;
    }

    SaveSexRateImage() {
        CommonFunction.SaveChartImage(this.SexRateChart, this.campusfullname + "性别比例");
    }


    mTeacherSub: ISimpleBar;

    ngOnInit(): void {
        if (this.service.SchoolOverview === undefined) {
            return;
        }
        this.route.params.subscribe(
            params => this.campusname = params['id']
        );
        if (this.campusname === "白") {
            this.campusfullname = "白杨校区";
            this.campusInfo = this.service.SchoolOverview.baiYang;
            //旭日图
            this.mSexRateSunburstOption.title.text = "白杨校区性别比例";
            this.mSexRateSunburstOption.title['show'] = false;
            this.mSexRateSunburstOption.series.data[0].value = this.campusInfo.property.sexRate.posCnt + this.campusInfo.property.sexRate.negCnt;

            this.mSexRateSunburstOption.series.data[0].children[0].value = this.campusInfo.grade1SexRate.posCnt + this.campusInfo.grade1SexRate.negCnt;
            this.mSexRateSunburstOption.series.data[0].children[0].children[0].value = this.campusInfo.grade1SexRate.posCnt;
            this.mSexRateSunburstOption.series.data[0].children[0].children[1].value = this.campusInfo.grade1SexRate.negCnt;

            this.mSexRateSunburstOption.series.data[0].children[1].value = this.campusInfo.grade2SexRate.posCnt + this.campusInfo.grade2SexRate.negCnt;
            this.mSexRateSunburstOption.series.data[0].children[1].children[0].value = this.campusInfo.grade2SexRate.posCnt;
            this.mSexRateSunburstOption.series.data[0].children[1].children[1].value = this.campusInfo.grade2SexRate.negCnt;

            this.mSexRateSunburstOption.series.data[0].children[2].value = this.campusInfo.grade3SexRate.posCnt + this.campusInfo.grade3SexRate.negCnt;
            this.mSexRateSunburstOption.series.data[0].children[2].children[0].value = this.campusInfo.grade3SexRate.posCnt;
            this.mSexRateSunburstOption.series.data[0].children[2].children[1].value = this.campusInfo.grade3SexRate.negCnt;
        } else {
            this.campusfullname = "东部校区";
            this.campusInfo = this.service.SchoolOverview.east;
            this.mSexRateOption.title.text = "东部校区性别比例";
            this.mSexRateOption.title['show'] = false;
            this.mSexRateOption.grid.bottom = '20%';
            this.mSexRateOption.grid.top = '20%';
            this.mSexRateOption.series[0].data[0].value = (this.campusInfo.property.sexRate.posCnt * 100 / this.campusInfo.property.studentCnt);
            this.mSexRateOption.series[0].data[1].value = (this.campusInfo.property.sexRate.negCnt * 100 / this.campusInfo.property.studentCnt);
            this.mSexRateOption.series[0].label.normal['formatter'] = param => (param.value).toFixed(2) + '%';
        }
        let subnamelist = [];
        let subcnt = [];
        for (const key in this.campusInfo.teacherSubCnt) {
            switch (key) {
              case "通用技术":
                subnamelist.push('技术'); //替换
                break;
              case "英语2":
                break;                    //不计算
              default:
                subnamelist.push(key);
                break;
            }
            if (key === "英语") {
              //英语和英语2一起计算
              subcnt.push(this.campusInfo.teacherSubCnt['英语'] + this.campusInfo.teacherSubCnt['英语2']);
            } else {
              if (key !== "英语2") subcnt.push(this.campusInfo.teacherSubCnt[key]);
            }
          }

        this.mTeacherSub = {
            xAxis: {
                type: 'category',
                data: subnamelist
            },
            title: {
                text: this.campusfullname + '教师人数'
            },
            tooltip: {},
            yAxis: {
                type: 'value'
            },
            series: [{
                label: {
                    normal: {
                        show: true
                    }
                },
                data: subcnt,
                type: 'bar'
            }]
        }
        this.mTeacherSub.title['show'] = false;
        this.mTeacherSub['toolbox'] = {
            'show': true,
            'feature': {
                'saveAsImage': {},
                'magicType': {
                    'type': ['line', 'bar']
                }
            }
        };
    }
    constructor(
        private service: HomeService,
        private route: ActivatedRoute,
    ) {

    }

}