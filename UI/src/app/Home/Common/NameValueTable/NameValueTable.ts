import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-namevalue',
    templateUrl: './NameValueTable.html'
})
export class NameValueTableComponent implements OnInit {
    cols: any;
    ngOnInit(): void {
        this.cols = [
            { field: 'name', header: this.TitleName },
            { field: 'value', header: this.TitleValue },
        ]
    }
    @Input() NameValueTable: { name: string, value: number };
    @Input() Title: string;
    @Input() TitleName: string;
    @Input() TitleValue: string;
    public display = false;
    show() {
        this.display = true;
    }
    hide() {
        this.display = false;
    }
}