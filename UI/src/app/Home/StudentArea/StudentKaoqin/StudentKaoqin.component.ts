import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IKaoqin } from '../../Common/Education.model';
import { CommonFunction } from '../../Common/common';
@Component({
    templateUrl: 'StudentKaoqin.component.html',
})
export class StudentKaoqinComponent implements OnInit{
    
    KaoqinList:IKaoqin[]
    ConvertNumberToWeekday = CommonFunction.ConvertNumberToWeekday;
    ngOnInit(): void {
        this.KaoqinList = this.service.CurrentStudentInfo.kaoqins; 
    }

    constructor(
        public service: HomeService
    ) {

    }
} 