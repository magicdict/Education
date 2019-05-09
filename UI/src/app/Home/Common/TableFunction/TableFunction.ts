import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
    selector: 'table-function',
    templateUrl: './TableFunction.html'
})
export class TableFunctionComponent {
    @Input() Table: Table;
    @Input() FrameStyle: string;
    @Input() OutputOnly = false;
    clearSelection() {
        //清除两次可以清除格式
        this.Table.selection = [];
        this.Table.selection = [];
    }
    exportCSV(selectionOnly: boolean) {
        if (selectionOnly) {
            this.Table.exportCSV({ selectionOnly: true });
        } else {
            this.Table.exportCSV();
        }
    }
}