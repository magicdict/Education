import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { IStudent, nationopt, policyopt } from '../Education.model';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { HomeService } from '../Home.service';

@Component({
  selector: 'app-studentPicker',
  templateUrl: './studentPicker.component.html'
})
export class StudentPickerComponent {
  @ViewChild(ErrorMessageDialogComponent)
  private errMsgDialog: ErrorMessageDialogComponent;

  @Output() pick: EventEmitter<any> = new EventEmitter();

  public display = false;

  public Students: IStudent[] = [];

  public selectStudent: IStudent;

  constructor(
    public service: HomeService
  ) {

  }

  show() {
    this.display = true;
    this.selectStudent = null;
    this.Students = [];
  }

  submit() {
    this.display = false;
    this.pick.emit(this.selectStudent);
  }

  close() {
    this.display = false;
  }

  public StudentId: string;
  public RoomNo: string;
  public NationName: string;
  public PolicyName: string;

  public nationlist = nationopt;
  public policylist = policyopt;

  Campus = [
    { label: '全部', value: '' },
    { label: '白杨', value: '白' },
    { label: '东部', value: '东' }
  ];
  selectedCampus: string = '';

  QueryByStudentId() {
    this.service.QueryByStudentId(this.StudentId).then(
      result => {
        if (result === null) {
          this.errMsgDialog.show("没有找到符合条件的学生！");
          this.Students = [];
        } else {
          this.Students = [result];
        }
      }
    );
  }

  QueryByNation() {
    this.service.QueryByNation(this.NationName).then(
      result => {
        if (result === null) {
          this.errMsgDialog.show("没有找到符合条件的学生！");
          this.Students = [];
        } else {
          this.Students = result;
        }
      }
    );
  }

  QueryByPolicy() {
    this.service.QueryByPolicy(this.PolicyName).then(
      result => {
        if (result === null) {
          this.errMsgDialog.show("没有找到符合条件的学生！");
          this.Students = [];
        } else {
          this.Students = result;
        }
      }
    );
  }
  
  QueryByLiveRoomNo() {
    this.service.QueryByLiveRoomNo(this.RoomNo,this.selectedCampus).then(
      result => {
        if (result === null) {
          this.errMsgDialog.show("没有找到符合条件的学生！");
          this.Students = [];
        } else {
          this.Students = result;
        }
      }
    );
  }

  onRowSelect() {
    this.display = false;
    this.pick.emit(this.selectStudent);
  }
}
