import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ITeacher, IStudent } from '../Education.model';
import { HomeService } from '../Home.service';
import { TeacherPickerComponent } from '../teacherPicker/teacherPicker.component'
import { ConfirmationService, SelectItem } from 'primeng/api';
import { StudentPickerComponent } from '../studentPicker/studentPicker.component';
import { Location } from '@angular/common';
import { ClassPickerComponent } from '../classPicker/classPicker.component';
import { ConfirmDialog } from 'primeng/confirmdialog';

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

  @ViewChild("confirm", { static: false }) confirm: ConfirmDialog;

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
    if (this.service.SchoolOverview === undefined) {
      //页面被强制刷新的时候，回到Home页面
      //第一次HOME页面进入的时候应该有数据，所以不会命中
      this.Home();
      return;
    }
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
    var ua = window.navigator.userAgent;
    //console.log(ua);
  }

  @ViewChild(TeacherPickerComponent, { static: false })
  private teacherpicker: TeacherPickerComponent;
  @ViewChild(StudentPickerComponent, { static: false })
  private studentpicker: StudentPickerComponent;
  @ViewChild(ClassPickerComponent, { static: false })
  private classpicker: ClassPickerComponent;


  StudentQuery() {
    if (this.pickhandler !== null && this.pickhandler !== undefined) {
      // 需要把上次的订阅取消掉，不然的话，多个订阅会同时发生效果！
      this.pickhandler.unsubscribe();
    }
    this.pickhandler = this.studentpicker.pick.subscribe((student: IStudent) => {
      this.router.navigate(['student/overview', student.id]);
    });
    this.studentpicker.show();
  }

  ClassQuery() {
    if (this.pickhandler !== null && this.pickhandler !== undefined) {
      // 需要把上次的订阅取消掉，不然的话，多个订阅会同时发生效果！
      this.pickhandler.unsubscribe();
    }
    this.pickhandler = this.classpicker.pick.subscribe((classitem: SelectItem) => {
      this.service.QueryByClassId(classitem.value).then(
        r => {
          if (r.length !== 0) {
            this.service.CurrentClassInfo = r;
            this.router.navigate(['class/overview', classitem.value]);
          }
        }
      )
    });
    this.classpicker.show();
  }

  TeacherQuery() {
    if (this.pickhandler !== null && this.pickhandler !== undefined) {
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
    this.router.navigate(['home/school']);
  }

  JumpTo(url: string) {
    if (url === 'home/course') {
      //全屏化之后不会再出现，这里可以放心修改掉图标
      this.confirm.acceptIcon = 'fa fas fa-diagnoses';
      this.confirm.rejectIcon = 'fa fas fa-diagnoses';
      this.confirmationService.confirm({
        message: '您可以使用五校联考或者十校联考作为7选3的基准，请选择一个基准',
        acceptLabel: '五校联考',
        rejectLabel: '十校联考',
        header: '确认信息',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate([url, "6"]);
          return;
        },
        reject: () => {
          this.router.navigate([url, "7"]);
          return;
        }
      });
    } else {
      this.router.navigate([url]);
    }
  }
}
