import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { ITeacher } from '../Education.model';
import { CommonFunction } from '../common';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-teacherPicker',
  templateUrl: './teacherPicker.component.html'
})
export class TeacherPickerComponent {
  @ViewChild(ErrorMessageDialogComponent)
  private errMsgDialog: ErrorMessageDialogComponent;

  @Output() pick: EventEmitter<any> = new EventEmitter();

  public display = false;

  public Teachers: ITeacher[] = [];

  public selectTeacher: ITeacher;

  Gradelist = [
    { label: '全部', value: '' },
    { label: '高一', value: '高一' },
    { label: '高二', value: '高二' },
    { label: '高三', value: '高三' }
  ]
  SelectGrade = '';

  Sublist = [
    { label: '语文', value: 1 },
    { label: '数学', value: 2 },
    { label: '英语', value: 3 },
    { label: '物理', value: 4 },
    { label: '化学', value: 5 },
    { label: '生物', value: 6 },
    { label: '体育', value: 9 },
    { label: '音乐', value: 11 },
    { label: '美术', value: 12 },
    { label: '政治', value: 17 },
    { label: '技术', value: 59 },
    { label: '历史', value: 7 },
    { label: '地理', value: 8 }
  ]
  SelectSub = '';

  constructor(
    private commonfunction: CommonFunction
  ) {

  }

  show() {
    this.display = true;
    this.selectTeacher = null;
    this.Teachers = [];
  }

  submit() {
    this.display = false;
    this.pick.emit(this.selectTeacher);
  }

  close() {
    this.display = false;
  }

  query() {

    if(this.SelectSub===""){
      this.errMsgDialog.show("请选择一种科目！");
      return;
    }

    let webapiurl = 'Teacher/QueryTeacher?GraName=' + String(this.SelectGrade) + '&SubId=' + String(this.SelectSub);
    this.commonfunction.httpRequest<ITeacher[]>(webapiurl).then(
      result => {
        if (result.length == 0) {
          this.errMsgDialog.show("没有找到符合条件的教师！");
          this.Teachers = [];
        } else {
          this.Teachers = result;
        }
      }
    );
  }
  onRowSelect() {
    this.display = false;
    this.pick.emit(this.selectTeacher);
  }
}
