import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../Common/Home.service';
import { CommonFunction } from '../common';
import { regionMapOptions } from '../../GraphOption/StudentGraphOption';

@Component({
    selector: 'app-map',
    templateUrl: './ChinaMap.html'
})
export class ChinaMapComponent implements OnInit, OnChanges {


    constructor(
        private http: HttpClient,
        public service: HomeService
    ) {

    }

    chinaChart: any;
    ChinaMapInit(chart: any) {
        this.chinaChart = chart;
    }
    zhejiangChart: any;
    ZhejiangMapInit(chart: any) {
        this.zhejiangChart = chart;
    }


    @Input() NativePlace: { name: string, value: number }[];
    @Input() NativePlaceZheJiang: { name: string, value: number }[];
    ChinaMapOption = CommonFunction.clone(regionMapOptions);
    ZheJiangMapOption = CommonFunction.clone(regionMapOptions);
    @Input() StyleHeight: string;
    @Input() StyleWidth: string;
    @Input() ViusalMax: number;

    NativePlaceZheJiangDetailOnly: { name: string, value: number }[];

    ngOnInit(): void {
        if (!this.service.IsMapReady) {
            this.http.get('assets/map/data-china.json')
                .subscribe(geoJson => {
                    registerMap('China', geoJson);
                    this.service.IsMapReady = true;
                });
            this.http.get('assets/map/data-zhejiang.json')
                .subscribe(geoJson => {
                    registerMap('zhejiang', geoJson);
                    this.service.IsMapReady = true;
                });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        //重新设置一下VisualMax的值    
        if (this.ViusalMax !== undefined) {
            this.ChinaMapOption.visualMap.max = this.ViusalMax;
            this.ZheJiangMapOption.visualMap.max = this.ViusalMax;
        } else {
            this.ChinaMapOption.visualMap.max = 100;
            this.ZheJiangMapOption.visualMap.max = 100;
        }
        this.ChinaMapOption.series[0].mapType = "China";
        this.ChinaMapOption.series[0].data = this.NativePlace;
        this.ChinaMapOption.title.text = "";
        this.ZheJiangMapOption.series[0].mapType = "zhejiang";
        this.ZheJiangMapOption.series[0].data =
            this.NativePlaceZheJiang.filter(x => x.name.startsWith("-")).
                map(x => { return { name: x.name.slice(1, 4), value: x.value } });
        this.ZheJiangMapOption.title.text = "";
        this.NativePlaceZheJiangDetailOnly = this.NativePlaceZheJiang.filter(x => !x.name.startsWith("-"));
        if (this.chinaChart !== undefined) {
            this.chinaChart.setOption(this.ChinaMapOption);
        }
        if (this.zhejiangChart !== undefined) {
            this.zhejiangChart.setOption(this.ZheJiangMapOption);
        }
    }

}