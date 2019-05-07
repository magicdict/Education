import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../Common/Home.service';


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
        series: [
            {
                type: 'tree',

                data: [],

                left: '2%',
                right: '2%',
                top: '8%',
                bottom: '20%',

                symbol: 'emptyCircle',

                orient: 'vertical',

                expandAndCollapse: true,

                label: {
                    normal: {
                        position: 'top',
                        rotate: -90,
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'bottom',
                            rotate: -90,
                            verticalAlign: 'middle',
                            align: 'left'
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