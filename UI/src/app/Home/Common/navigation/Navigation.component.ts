import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IStudent, classopt } from '../../../Education.model';
import { HomeService } from '../../Home.service';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-nav',
  templateUrl: 'Navigation.html',
})
export class NavigationComponent implements OnInit {
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    public service: HomeService
  ) {

  }

  fullScreen() {
    let el = document.documentElement as any;
    let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs != "undefined" && rfs) {
      rfs.call(el);
    };
    return;
  }


  ngOnInit(): void {
    if (this.service.IsFirstRun === false) {
      this.confirmationService.confirm({
        message: '推荐在全屏模式下进行数据展示以获得最佳视觉效果，是否启用全屏模式？',
        acceptLabel: '确定',
        rejectLabel: '取消',
        header: '确认信息',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.fullScreen();
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
  public StudentId: string;
  public ClassId: string;
  public QueryResult: IStudent[];
  public classlist = classopt;

  QueryByStudentId() {
    this.service.QueryByStudentId(this.StudentId).then(
      r => {
        this.QueryResult = r;
        if (r.length === 1) {
          this.router.navigate(['student/overview', r[0].id]);
        } else {
          this.errMsgDialog.show("该学号的学生不存在！");
        }
      }
    )
  }

  QueryByClassId() {
    this.service.QueryByClassId(this.ClassId).then(
      r => {
        this.QueryResult = r;
        if (r.length !== 0) {
          this.service.CurrentClassInfo = r;
          this.router.navigate(['class/overview', this.ClassId]);
        }
      }
    )
  }

  JumpTo(url: string) {
    this.router.navigate([url]);
  }
}
