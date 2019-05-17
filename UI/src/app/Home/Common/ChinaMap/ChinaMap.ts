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

    SaveChinaMap() {
        CommonFunction.SaveChartImage(this.chinaChart, "全国生源地图")
    }
    SaveZhejiangMap() {
        CommonFunction.SaveChartImage(this.zhejiangChart, "浙江省生源地图")
    }


    @Input() Title = "";
    @Input() NativePlace: { name: string, value: number }[];
    @Input() NativePlaceZheJiang: { name: string, value: number }[];
    ChinaMapOption = CommonFunction.clone(regionMapOptions);
    ZheJiangMapOption = CommonFunction.clone(regionMapOptions);
    @Input() StyleHeight: string;
    @Input() StyleWidth: string;
    @Input() ViusalChinaMax: number;
    @Input() ViusalZheJiangMax: number;

    NativePlaceZheJiangDetailOnly: { name: string, value: number }[];

    ngOnInit(): void {
        if (!this.service.IsChinaMapReady) {
            this.http.get('assets/map/data-china.json')
                .subscribe(geoJson => {
                    registerMap('China', geoJson);
                    this.service.IsChinaMapReady = true;
                });
        }
        if (!this.service.IsZheJiangMapReady) {
            this.http.get('assets/map/data-zhejiang.json')
                .subscribe(geoJson => {
                    registerMap('zhejiang', geoJson);
                    this.service.IsZheJiangMapReady = true;
                });
        }
    }

    ngOnChanges(_changes: SimpleChanges): void {
        //重新设置一下VisualMax的值    
        this.ChinaMapOption.visualMap.max = 100;
        this.ZheJiangMapOption.visualMap.max = 100;
        if (this.ViusalChinaMax !== undefined) {
            this.ChinaMapOption.visualMap.max = this.ViusalChinaMax;
        }
        if (this.ViusalZheJiangMax !== undefined) {
            this.ZheJiangMapOption.visualMap.max = this.ViusalZheJiangMax;
        }
        this.ChinaMapOption.series[0].mapType = "China";
        this.ChinaMapOption.series[0].data = this.NativePlace;
        this.ChinaMapOption.title.text = this.Title + "全国生源地图";
        this.ChinaMapOption.title['show'] = false;

        this.ZheJiangMapOption.series[0].mapType = "zhejiang";
        this.ZheJiangMapOption.series[0].data =
            this.NativePlaceZheJiang.filter(x => x.name.startsWith("-")).
                map(x => { return { name: x.name.slice(1, 4), value: x.value } });
        this.ZheJiangMapOption.title.text = this.Title + "浙江省生源地图";
        this.ZheJiangMapOption.title['show'] = false;
        this.NativePlaceZheJiangDetailOnly = this.NativePlaceZheJiang.filter(x => !x.name.startsWith("-"));
        if (this.chinaChart !== undefined) {
            this.chinaChart.setOption(this.ChinaMapOption);
        }
        if (this.zhejiangChart !== undefined) {
            this.zhejiangChart.setOption(this.ZheJiangMapOption);
        }
    }

}