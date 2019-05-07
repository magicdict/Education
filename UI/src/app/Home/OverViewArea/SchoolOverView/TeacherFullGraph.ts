import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../Common/Home.service';
import { ToolboxSaveImageOnly } from '../../GraphOption/KaoqinOption';


@Component({
    templateUrl: './TeacherFullGraph.html'
})
export class FullTeacherComponent implements OnInit {
    constructor(
        private http: HttpClient,
        public service: HomeService
    ) {

    }

    option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        toolbox: ToolboxSaveImageOnly,
        title: {
            text: '教师全体树形图',
            show: false
        },
        series: [
            {
                type: 'tree',
                data: [],
                initialTreeDepth:2,
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbol: 'emptyCircle',

                expandAndCollapse: true,

                label: {
                    normal: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 12
                        }
                    }
                },

                animationDurationUpdate: 750
            }
        ]
    };
    IsMapReady = false;
    ngOnInit(): void {
        if (!this.IsMapReady) {
            this.http.get('assets/Teacher.json')
                .subscribe(teacherjson => {
                    this.option.series[0].data[0] = teacherjson;
                    this.IsMapReady = true;
                });
        }
    }
}