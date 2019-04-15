import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ICampus } from '../../Common/Education.model';
import { SexRatePieOption, SexRateSunburstOption } from '../../GraphOption/StudentGraphOption';
import { CommonFunction } from '../../Common/common';
import { ISimpleBar } from '../../GraphOption/KaoqinOption';


@Component({
    selector: "campus",
    templateUrl: 'Campus.html',
})
export class CampusComponent implements OnInit {

    display = false;

    campusfullname: string;

    @Input() campusname: string;

    campusInfo: ICampus;
    /**性别饼图 */
    mSexRatePieOption = CommonFunction.clone(SexRatePieOption);
    /**旭日图 性别比例 */
    mSexRateSunburstOption = CommonFunction.clone(SexRateSunburstOption);

    mTeacherSub: ISimpleBar;

    ngOnInit(): void {

        if (this.campusname === "白") {
            this.campusfullname = "白杨校区";
            this.campusInfo = this.service.SchoolOverview.baiYang;
            //旭日图
            this.mSexRateSunburstOption.title.text = "";
            this.mSexRateSunburstOption.series.data[0].value = this.campusInfo.property.totalSexRate.maleCnt + this.campusInfo.property.totalSexRate.femaleCnt;

            this.mSexRateSunburstOption.series.data[0].children[0].value = this.campusInfo.grade1SexRate.maleCnt + this.campusInfo.grade1SexRate.femaleCnt;
            this.mSexRateSunburstOption.series.data[0].children[0].children[0].value = this.campusInfo.grade1SexRate.maleCnt;
            this.mSexRateSunburstOption.series.data[0].children[0].children[1].value = this.campusInfo.grade1SexRate.femaleCnt;

            this.mSexRateSunburstOption.series.data[0].children[1].value = this.campusInfo.grade2SexRate.maleCnt + this.campusInfo.grade2SexRate.femaleCnt;
            this.mSexRateSunburstOption.series.data[0].children[1].children[0].value = this.campusInfo.grade2SexRate.maleCnt;
            this.mSexRateSunburstOption.series.data[0].children[1].children[1].value = this.campusInfo.grade2SexRate.femaleCnt;

            this.mSexRateSunburstOption.series.data[0].children[2].value = this.campusInfo.grade3SexRate.maleCnt + this.campusInfo.grade3SexRate.femaleCnt;
            this.mSexRateSunburstOption.series.data[0].children[2].children[0].value = this.campusInfo.grade3SexRate.maleCnt;
            this.mSexRateSunburstOption.series.data[0].children[2].children[1].value = this.campusInfo.grade3SexRate.femaleCnt;
        } else {
            this.campusfullname = "东部校区";
            this.campusInfo = this.service.SchoolOverview.east;
            this.mSexRatePieOption.title.text = "";
            this.mSexRatePieOption.series[0].data[0].value = this.campusInfo.property.totalSexRate.maleCnt;
            this.mSexRatePieOption.series[0].data[1].value = this.campusInfo.property.totalSexRate.femaleCnt;
        }

        let subnamelist = [];
        let subcnt = [];
        for (const key in this.campusInfo.teacherSubCnt) {
            subnamelist.push(key);
            subcnt.push(this.campusInfo.teacherSubCnt[key]);
        }

        this.mTeacherSub = {
            xAxis: {
                type: 'category',
                data: subnamelist
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
                data: subcnt,
                type: 'bar'
            }]
        }


    }
    constructor(
        private service: HomeService
    ) {

    }

    show() {
        this.display = true;
    }

    submit() {
        this.display = false;
    }

    close() {
        this.display = false;
    }

}