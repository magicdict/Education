import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { IStudent } from '../Common/Education.model';
@Component({
    selector: "visual-factory",
    templateUrl: 'VisualFactory.html',
})
export class VisualFactoryComponent implements OnInit {
    ngOnInit(): void {

    }
    @Output() GotoNextPage = new EventEmitter();
    @Output() GotoPreviousPage = new EventEmitter();
}