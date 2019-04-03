import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { IStudent, ITeacher, IScore } from 'src/app/Home/Common/Education.model';
import { Router } from '@angular/router';
 
@Component({
    templateUrl: 'Grade3Score.html',
})
export class Grade3ScoreComponent implements OnInit {
    constructor(
        private router: Router, 
        public service: HomeService
    ) {

    }
    public CurrentStudent: IStudent;
    public Teachers: ITeacher[];
    public Scores:IScore[];

    ngOnInit(): void {
        //成绩列表
        this.CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
        this.Teachers = this.service.CurrentStudentInfo.teachers;
        this.Scores = this.service.CurrentStudentInfo.chengjis;
        //按照考试科目进行分组        
    }
    JumpToTeacher(teacherid: string) {
        this.router.navigate(['teacher/overview', teacherid]);
    }
};  