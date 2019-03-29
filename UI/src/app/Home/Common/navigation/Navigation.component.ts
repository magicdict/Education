import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { classopt, ITeacher, IStudent } from '../Education.model';
import { HomeService } from '../Home.service';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { TeacherPickerComponent } from '../teacherPicker/teacherPicker.component'
import { ConfirmationService } from 'primeng/api';
import { StudentPickerComponent } from '../studentPicker/studentPicker.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: 'Navigation.html',
})
export class NavigationComponent implements OnInit {
  constructor(
    private router: Router,
    private _location: Location,
    private confirmationService: ConfirmationService,
    public service: HomeService
  ) {

  }

  /**全屏模式 */
  fullScreen() {
    let el = document.documentElement as any;
    let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs != "undefined" && rfs) {
      rfs.call(el);
    };
    return;
  }

  // 订阅句柄
  private pickhandler: any;

  ngOnInit(): void {
    if (this.service.IsFirstRun === false) {
      this.service.IsFirstRun = true;
      this.confirmationService.confirm({
        message: '推荐在全屏模式下进行数据展示以获得最佳视觉效果，是否启用全屏模式？',
        acceptLabel: '确定',
        rejectLabel: '取消',
        header: '确认信息',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.fullScreen();
          this.service.IsFullScreen = true;
          return;
        },
        reject: () => {
          return;
        }
      });
    }
  }

  @ViewChild(ErrorMessageDialogComponent)
  private errMsgDialog: ErrorMessageDialogComponent;
  @ViewChild(TeacherPickerComponent)
  private teacherpicker: TeacherPickerComponent;
  @ViewChild(StudentPickerComponent)
  private studentpicker: StudentPickerComponent;
  public StudentId: string;
  public ClassId: string;
  public classlist = classopt;

  QueryByStudentId() {
    this.service.QueryByStudentId(this.StudentId).then(
      r => {
        if (r !== null) {
          this.router.navigate(['student/overview', r.id]);
        } else {
          this.errMsgDialog.show("该学号的学生不存在！");
        }
      }
    )
  }

  StudentQuery() {
    if (this.pickhandler != null) {
      // 需要把上次的订阅取消掉，不然的话，多个订阅会同时发生效果！
      this.pickhandler.unsubscribe();
    }
    this.pickhandler = this.studentpicker.pick.subscribe((student: IStudent) => {
      this.router.navigate(['student/overview', student.id]);
    });
    this.studentpicker.show();
  }

  QueryByClassId() {
    this.service.QueryByClassId(this.ClassId).then(
      r => {
        if (r.length !== 0) {
          this.service.CurrentClassInfo = r;
          this.router.navigate(['class/overview', this.ClassId]);
        }
      }
    )
  }

  TeacherQuery() {
    if (this.pickhandler != null) {
      // 需要把上次的订阅取消掉，不然的话，多个订阅会同时发生效果！
      this.pickhandler.unsubscribe();
    }
    this.pickhandler = this.teacherpicker.pick.subscribe((teacher: ITeacher) => {
      this.router.navigate(['teacher/overview', teacher.id]);
    });
    this.teacherpicker.show();
  }

  Return() {
    this._location.back();
  }
  Home() {
    this.router.navigate(['']);
  }

  JumpTo(url: string) {
    this.router.navigate([url]);
  }
}
