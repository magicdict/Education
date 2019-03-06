import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../Home.service';
import { CommonFunction } from 'src/app/common';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/internal/operators';

@Component({
    templateUrl: 'StudentCompumption.html',
})
export class StudentCompumptionComponent implements OnInit {

    constructor(
        public studentSerice: HomeService,
        private router: Router,
        private route: ActivatedRoute
    ) {

    }




    ngOnInit(): void {
        //1.按照时段进行统计，某个时段，每天平均消费数
        this.GetDiaryAvgByTimeRange();

    }

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


        let Compumptions = this.studentSerice.CurrentStudentInfo.consumptions;
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

        this.DiaryAvgByTimeRangeOpt.series[0].data[0].value = avg1;
        this.DiaryAvgByTimeRangeOpt.series[0].data[1].value = avg2;
        this.DiaryAvgByTimeRangeOpt.series[0].data[2].value = avg3;

        this.DiaryAvgByTimeRangeInfo1 = "10点之前，每日平均消费：" + avg1 + "元（" + DayCnt1 + "天," + DealCnt1 + "笔) ";
        this.DiaryAvgByTimeRangeInfo2 = "16点之前，每日平均消费：" + avg2 + "元（" + DayCnt2 + "天," + DealCnt2 + "笔) ";
        this.DiaryAvgByTimeRangeInfo3 = "24点之前，每日平均消费：" + avg3 + "元（" + DayCnt3 + "天," + DealCnt3 + "笔) ";

        this.TotalByTimeRangeInfo1 = "10点之前总共消费金额：" + CommonFunction.roundvalue(Sum1) + "元（" + DayCnt1 + "天," + DealCnt1 + "笔) ";
        this.TotalByTimeRangeInfo2 = "16点之前总共消费金额：" + CommonFunction.roundvalue(Sum2) + "元（" + DayCnt2 + "天," + DealCnt2 + "笔) ";
        this.TotalByTimeRangeInfo3 = "24点之前总共消费金额：" + CommonFunction.roundvalue(Sum3) + "元（" + DayCnt3 + "天," + DealCnt3 + "笔) ";


        this.TotalByTimeRangeOpt.series[0].data[0].value = CommonFunction.roundvalue(Sum1);
        this.TotalByTimeRangeOpt.series[0].data[1].value = CommonFunction.roundvalue(Sum2);
        this.TotalByTimeRangeOpt.series[0].data[2].value = CommonFunction.roundvalue(Sum3);

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
        this.DiaryCompumptionOpt.xAxis.data = diaryDateArray;
        this.DiaryCompumptionOpt.series[0].data = diaryMoneyArray;
    }

    DiaryAvgByTimeRangeInfo1: string;
    DiaryAvgByTimeRangeInfo2: string;
    DiaryAvgByTimeRangeInfo3: string;

    TotalByTimeRangeInfo1: string;
    TotalByTimeRangeInfo2: string;
    TotalByTimeRangeInfo3: string;



    DiaryAvgByTimeRangeOpt = {
        title: {
            text: '按照时段统计每日平均消费',
            subtext: '10点之前，16点之前，24点之前',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['10点之前', '16点之前', '24点之前']
        },
        series: [
            {
                name: '每日平均消费',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 0, name: '10点之前' },
                    { value: 0, name: '16点之前' },
                    { value: 0, name: '24点之前' },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    TotalByTimeRangeOpt = {
        title: {
            text: '按照时段统计总消费',
            subtext: '10点之前，16点之前，24点之前',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['10点之前', '16点之前', '24点之前']
        },
        series: [
            {
                name: '总消费',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 0, name: '10点之前' },
                    { value: 0, name: '16点之前' },
                    { value: 0, name: '24点之前' },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    DiaryCompumptionOpt = {
        title: {
            text: '每日消费',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{b}\n{c}'
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 10,
            end: 90
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                label: {
                    normal: {
                        show: true
                    }
                },
                data: [],
                type: 'bar'
            }
        ]
    };


    Return() {
        let id = this.route.snapshot.paramMap.get('id');
        this.router.navigate(['../../', id], { relativeTo: this.route });
    }

}