import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-message-dialog',
  templateUrl: './image-message-dialog.component.html'
})
export class ImageMessageDialogComponent implements OnInit {

  @Input()
  set display(val: boolean) {
    this._display = val;
  }
  get display(): boolean { return this._display; }

  constructor() { }

  private _display = false;
  @Input() ImageURL: string;
  @Input() MsgContent: string;

  /** 由于无法阻止代码的执行，所以这里使用回掉进行后续处理 */
  public callbackMethod: any;

  show() {
    this._display = true;
  }

  hide() {
    if (this.callbackMethod != null) { this.callbackMethod(); }
    this.callbackMethod = null;
    this._display = false;
  }

  ngOnInit() {
  }

}
