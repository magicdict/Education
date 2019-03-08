import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-message-dialog',
  templateUrl: './error-message-dialog.component.html'
})
export class ErrorMessageDialogComponent implements OnInit {

  @Input()
  set display(val: boolean) {
    this._display = val;
  }
  get display(): boolean { return this._display; }

  get errorMsgContent(): string { return this._errorMsgContent; }

  constructor() { }

  private _display = false;
  private _errorMsgContent: string;

  /** 由于无法阻止代码的执行，所以这里使用回掉进行后续处理 */
  public callbackMethod: any;

  show(errorMsgContent: string) {
    this._display = true;
    this._errorMsgContent = errorMsgContent;
  }

  hide() {
    if (this.callbackMethod != null) { this.callbackMethod(); }
    this.callbackMethod = null;
    this._display = false;
  }

  ngOnInit() {
  }

}
