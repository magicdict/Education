import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
    templateUrl: 'ReportCenter.html',
    styles: [`
        .ui-steps .ui-steps-item {
            width: 25%;
        }

        .ui-steps.steps-custom {
            margin-bottom: 30px;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-menuitem-link {
            height: 10px;
            padding: 0 1em;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-steps-number {
            background-color: #0081c2;
            color: #FFFFFF;
            display: inline-block;
            width: 36px;
            border-radius: 50%;
            margin-top: -14px;
            margin-bottom: 10px;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-steps-title {
            color: #555555;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class ReportCenterComponent implements OnInit {

    items: MenuItem[];

    activeIndex: number = 0;

    ngOnInit(): void {
        this.items = [
            {
                label: '过滤条件',
            },
            {
                label: '数据展示',
            },
            {
                label: '可视化',
            },
            {
                label: '预测',
            }
        ];
    }
} 