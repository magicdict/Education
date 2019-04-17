import { Component, OnInit, Input } from '@angular/core';
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../Common/Home.service';

@Component({
    selector: 'app-map',
    templateUrl: './ChinaMap.html'
})
export class ChinaMapComponent implements OnInit {

    constructor(
        private http: HttpClient,
        public service: HomeService
    ) {

    }
    @Input() NativePlace:any;
    @Input() NativePlaceZheJiang:any;
    @Input() MapOption:any;
    @Input() StyleHeight:string;
    @Input() StyleWidth:string;

    ngOnInit(): void {
        if (!this.service.IsMapReady){
            this.http.get('assets/china.json')
            .subscribe(geoJson => {
                registerMap('China', geoJson);
                this.service.IsMapReady = true;
            });
        }
    }
}