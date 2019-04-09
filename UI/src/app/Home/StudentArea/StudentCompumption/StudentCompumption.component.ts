import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { CommonFunction } from 'src/app/Home/Common/common';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';
import { DiaryAvgByTimeRangeOption, TotalByTimeRangeOption, DiaryCompumptionOption } from '../../GraphOption/CompumptionOption';
import { ISimpleBar } from '../../GraphOption/KaoqinOption';
@Component({
    templateUrl: 'StudentCompumption.html',
})
export class StudentCompumptionComponent implements OnInit {

    constructor(
        public service: HomeService
    ) {

    }
    ngOnInit(): void {
        //1.按照时段进行统计，某个时段，每天平均消费数
        this.GetDiaryAvgByTimeRange();
        //2.按照星期统计
        this.GetDiaryAvgByWeekday();

    }
    ConvertNumberToWeekday = CommonFunction.ConvertNumberToWeekday;
    Compumptions = this.service.CurrentStudentInfo.consumptions;

    mDiaryAvgByTimeRangeOpt = CommonFunction.clone(DiaryAvgByTimeRangeOption);
    mTotalByTimeRangeOpt = CommonFunction.clone(TotalByTimeRangeOption);
    mDiaryCompumptionOpt = CommonFunction.clone(DiaryCompumptionOption);

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

        console.log(WeekArray);
    }
}