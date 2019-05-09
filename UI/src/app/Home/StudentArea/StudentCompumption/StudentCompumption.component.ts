import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { CommonFunction } from 'src/app/Home/Common/common';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { DiaryAvgByTimeRangeOption, TotalByTimeRangeOption, DiaryCompumptionOption, DairyCanlendarOption } from '../../GraphOption/CompumptionOption';
import { ISimpleBar, ToolboxForBar } from '../../GraphOption/KaoqinOption';
import { Router } from '@angular/router';
import { IConsumption } from '../../Common/Education.model';
@Component({
    templateUrl: 'StudentCompumption.html',
})
export class StudentCompumptionComponent implements OnInit {

    constructor(
        private router: Router,
        public service: HomeService
    ) {

    }

    GetWeatherImageByText = CommonFunction.GetWeatherImageByText;

    cols = [
        { field: 'dealTime', header: "时间" },
        { field: 'monDeal', header: "金额" },
        { field: 'dayOfWeek', header: "星期" },
        { field: 'weather.high', header: "最高温度" },
        { field: 'weather.low', header: "最低温度" },
        { field: 'weather.type', header: "天气" },
    ];

    ngOnInit(): void {
        if (this.service.CurrentStudentInfo === undefined) {
            this.router.navigate(['home/school']);
        }
        this.Compumptions = this.service.CurrentStudentInfo.consumptions;
        //1.按照时段进行统计，某个时段，每天平均消费数
        this.GetDiaryAvgByTimeRange();
        //2.按照星期统计
        this.GetDiaryAvgByWeekday();
        //3.统计单笔消费的消费区间
        this.GetPerRangeCnt();
    }
    ConvertNumberToWeekday = CommonFunction.ConvertNumberToWeekday;
    Compumptions:IConsumption[] = [];

    mDiaryAvgByTimeRangeOpt = CommonFunction.clone(DiaryAvgByTimeRangeOption);
    mTotalByTimeRangeOpt = CommonFunction.clone(TotalByTimeRangeOption);
    mDiaryCompumptionOpt = CommonFunction.clone(DiaryCompumptionOption);
    mDirayCanlendarOpt = CommonFunction.clone(DairyCanlendarOption);

    DiaryAvgByTimeRangeInfo1: string;
    DiaryAvgByTimeRangeInfo2: string;
    DiaryAvgByTimeRangeInfo3: string;

    TotalByTimeRangeInfo1: string;
    TotalByTimeRangeInfo2: string;
    TotalByTimeRangeInfo3: string;
    /** 按照时段进行统计，某个时段，每天平均消费数 */
    GetDiaryAvgByTimeRange() {
        //00:00-10:00   早餐
        //10:01-16:00   午餐
        //16:00-23:59   晚餐
        //如果某日某时段没有消费，则为空，不是0；

        let DayCnt1 = 0;
        let DayCnt2 = 0;
        let DayCnt3 = 0;

        let Sum1 = 0;
        let Sum2 = 0;
        let Sum3 = 0;

        let DealCnt1 = 0;
        let DealCnt2 = 0;
        let DealCnt3 = 0;


        let Compumptions = this.service.CurrentStudentInfo.consumptions;
        let KeyBreak1 = "";
        let KeyBreak2 = "";
        let KeyBreak3 = "";

        Compumptions.forEach(Compumption => {
            let DealDate = Compumption.dealTimeYear + Compumption.dealTimeMonth + Compumption.dealTimeDay;
            if (Compumption.dealTimeHour < 10) {
                Sum1 += -1 * Compumption.monDeal;
                DealCnt1++;
                if (KeyBreak1 !== DealDate) {
                    DayCnt1++;
                    KeyBreak1 = DealDate;
                }
            }
            if (Compumption.dealTimeHour >= 10 && Compumption.dealTimeHour < 16) {
                Sum2 += -1 * Compumption.monDeal;
                DealCnt2++;
                if (KeyBreak2 !== DealDate) {
                    DayCnt2++;
                    KeyBreak2 = DealDate;
                }
            }
            if (Compumption.dealTimeHour >= 16) {
                Sum3 += -1 * Compumption.monDeal;
                DealCnt3++;
                if (KeyBreak3 !== DealDate) {
                    DayCnt3++;
                    KeyBreak3 = DealDate;
                }
            }
        });

        let avg1 = 0;
        let avg2 = 0;
        let avg3 = 0;

        if (DayCnt1 !== 0) avg1 = CommonFunction.roundvalue(Sum1 / DayCnt1);
        if (DayCnt2 !== 0) avg2 = CommonFunction.roundvalue(Sum2 / DayCnt2);
        if (DayCnt3 !== 0) avg3 = CommonFunction.roundvalue(Sum3 / DayCnt3);

        this.mDiaryAvgByTimeRangeOpt.series[0].data[0].value = avg1;
        this.mDiaryAvgByTimeRangeOpt.series[0].data[1].value = avg2;
        this.mDiaryAvgByTimeRangeOpt.series[0].data[2].value = avg3;

        this.DiaryAvgByTimeRangeInfo1 = "10点之前，每日平均消费：" + avg1 + "元（" + DayCnt1 + "天," + DealCnt1 + "笔) ";
        this.DiaryAvgByTimeRangeInfo2 = "16点之前，每日平均消费：" + avg2 + "元（" + DayCnt2 + "天," + DealCnt2 + "笔) ";
        this.DiaryAvgByTimeRangeInfo3 = "24点之前，每日平均消费：" + avg3 + "元（" + DayCnt3 + "天," + DealCnt3 + "笔) ";

        this.TotalByTimeRangeInfo1 = "10点之前总共消费金额：" + CommonFunction.roundvalue(Sum1) + "元（" + DayCnt1 + "天," + DealCnt1 + "笔) ";
        this.TotalByTimeRangeInfo2 = "16点之前总共消费金额：" + CommonFunction.roundvalue(Sum2) + "元（" + DayCnt2 + "天," + DealCnt2 + "笔) ";
        this.TotalByTimeRangeInfo3 = "24点之前总共消费金额：" + CommonFunction.roundvalue(Sum3) + "元（" + DayCnt3 + "天," + DealCnt3 + "笔) ";


        this.mTotalByTimeRangeOpt.series[0].data[0].value = CommonFunction.roundvalue(Sum1);
        this.mTotalByTimeRangeOpt.series[0].data[1].value = CommonFunction.roundvalue(Sum2);
        this.mTotalByTimeRangeOpt.series[0].data[2].value = CommonFunction.roundvalue(Sum3);

        let diaryDateArray = [];
        let diaryMoneyArray = [];

        from(Compumptions).pipe(
            groupBy(x => x.dealTimeYear + "/" + x.dealTimeMonth + "/" + x.dealTimeDay),
            mergeMap(x => x.pipe(toArray()))
        ).subscribe(
            r => {
                diaryDateArray.push(r[0].dealTimeYear + "/" + r[0].dealTimeMonth + "/" + r[0].dealTimeDay);
                diaryMoneyArray.push(Number(CommonFunction.roundvalue(r.map(x => -x.monDeal).reduce((sum, current) => sum + current))));
            }
        )
        this.mDiaryCompumptionOpt.xAxis.data = diaryDateArray;
        this.mDiaryCompumptionOpt.series[0].data = diaryMoneyArray;

        let DiaryDate = [];
        for (let index = 0; index < diaryDateArray.length; index++) {
            DiaryDate.push([diaryDateArray[index], diaryMoneyArray[index]])
        }
        this.mDirayCanlendarOpt.visualMap[0].max = 100;
        this.mDirayCanlendarOpt.title.text = "消费日历";
        this.mDirayCanlendarOpt.title.show = true;
        this.mDirayCanlendarOpt.series[0].data = DiaryDate;
        this.mDirayCanlendarOpt.series[0].symbolSize = (val: any[]) => { return val[1] / 5; };

        this.mDirayCanlendarOpt.series[1].data = DiaryDate;
        this.mDirayCanlendarOpt.series[1].symbolSize = (val: any[]) => { return val[1] / 5; };

    }

    /**星期统计 */
    WeekDayOption: ISimpleBar;


    GetDiaryAvgByWeekday() {
        let Compumptions = this.service.CurrentStudentInfo.consumptions;
        let WeekArray: number[] = [0, 0, 0, 0, 0, 0, 0];
        Compumptions.forEach(Compumption => {
            //按照星期进行统计
            WeekArray[Compumption.dayOfWeek] += -1 * Compumption.monDeal;
        });
        for (let index = 0; index < 7; index++) {
            WeekArray[index] = CommonFunction.roundvalue(WeekArray[index]);
        }
        this.WeekDayOption = {
            title: {
                text: '周别消费总金额'
            },
            toolbox:ToolboxForBar,
            xAxis: {
                type: 'category',
                data: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
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
                data: WeekArray,
                type: 'bar'
            }]
        };

        //console.log(WeekArray);
    }

    /**单笔消费金额统计 */
    PerRangeCntOption: ISimpleBar;

    GetPerRangeCnt() {
        let Compumptions = this.service.CurrentStudentInfo.consumptions;
        let RangeArray: number[] = [0, 0, 0, 0];
        RangeArray[0] = Compumptions.filter(x => (-1 * x.monDeal) <= 10).length;
        RangeArray[1] = Compumptions.filter(x => (-1 * x.monDeal) <= 20 && (-1 * x.monDeal) > 10).length;
        RangeArray[2] = Compumptions.filter(x => (-1 * x.monDeal) <= 50 && (-1 * x.monDeal) > 20).length;
        RangeArray[3] = Compumptions.filter(x => (-1 * x.monDeal) > 50).length;

        for (let index = 0; index < 4; index++) {
            RangeArray[index] = CommonFunction.roundvalue(RangeArray[index]);
        }
        this.PerRangeCntOption = {
            title: {
                text: '单笔消费金额'
            },
            toolbox:ToolboxForBar,
            xAxis: {
                type: 'category',
                data: ["10元以下", "10-20元", "20元-50元", "50元以上"]
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
                data: RangeArray,
                type: 'bar'
            }]
        };
    }

}