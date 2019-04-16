import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-namevalue',
    templateUrl: './NameValueTable.html'
})
export class NameValueTableComponent {
    @Input() NameValueTable: { name: string, value: number };
    @Input() Title: string;
    public display = false;
    show() {
        this.display = true;
    }
    hide() {
        this.display = false;
    }
}