import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IKaoqin } from '../../Common/Education.model';
import { CommonFunction } from '../../Common/common';
import { ISimpleBar, ToolboxForBar } from '../../GraphOption/KaoqinOption';
import { Router } from '@angular/router';
@Component({
    templateUrl: 'StudentKaoqin.component.html',
})
export class StudentKaoqinComponent implements OnInit {
    cols = [
        { field: 'recDateTime', header: "时间" },
        { field: 'controllerName', header: "类型" },
        { field: 'dayOfWeek', header: "星期" },
        { field: 'weather.high', header: "最高温度" },
        { field: 'weather.low', header: "最低温度" },
        { field: 'weather.type', header: "天气" },
    ];
    KaoqinList: IKaoqin[]
    GetWeatherImageByText = CommonFunction.GetWeatherImageByText;
    ConvertNumberToWeekday = CommonFunction.ConvertNumberToWeekday;
    KaoqinOption: ISimpleBar;

    ngOnInit(): void {
        if (this.service.CurrentStudentInfo === undefined) {
            this.router.navigate(['home/school']);
        }
        this.KaoqinList = this.service.CurrentStudentInfo.kaoqins;
        let CntArray: number[] = [];
        let NameArray: string[] = [];

        this.KaoqinList.forEach(element => {
            if (NameArray.indexOf(element.controllerName) === -1) {
                NameArray.push(element.controllerName);
            }
        });

        NameArray.forEach(
            e => {
                CntArray.push(this.KaoqinList.filter(x => x.controllerName === e).length);
            }
        )

        NameArray = NameArray.map(x => x.replace("[", "\n["))

        this.KaoqinOption = {
            title: {
                text: '考勤统计'
            },
            tooltip: {},
            toolbox: ToolboxForBar,
            xAxis: {
                type: 'category',
                data: NameArray,
                axisLabel: {
                    interval: 0
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
                data: CntArray,
                type: 'bar'
            }]
        };


    }
    constructor(
        private router: Router,
        public service: HomeService
    ) {

    }
} 