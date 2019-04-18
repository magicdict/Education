import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IKaoqin } from '../../Common/Education.model';
import { CommonFunction } from '../../Common/common';
@Component({
    templateUrl: 'StudentKaoqin.component.html',
})
export class StudentKaoqinComponent implements OnInit{
    cols = [
        { field: 'recDateTime', header: "时间" },
        { field: 'controllerName', header: "类型" },
        { field: 'dayOfWeek', header: "星期" },
        { field: 'weather.high', header: "最高温度" },
        { field: 'weather.low', header: "最低温度" },
        { field: 'weather.type', header: "天气" },
    ];
    KaoqinList:IKaoqin[]
    GetWeatherImageByText = CommonFunction.GetWeatherImageByText;
    ConvertNumberToWeekday = CommonFunction.ConvertNumberToWeekday;
    ngOnInit(): void {
        this.KaoqinList = this.service.CurrentStudentInfo.kaoqins; 
    }

    constructor(
        public service: HomeService
    ) {

    }
} 