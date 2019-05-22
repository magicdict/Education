import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { IClassInfo } from '../Common/Education.model';
import { CommonFunction } from '../Common/common';
import { SexRatePieOption } from '../GraphOption/StudentGraphOption';
import { ToolboxForBar } from '../GraphOption/KaoqinOption';
import { MonthlyCompumptionBarOptionTotal } from '../GraphOption/CompumptionOption';
@Component({
    selector: "visual-factory",
    templateUrl: 'VisualFactory.html',
})
export class VisualFactoryComponent implements OnInit {

    constructor(
        private service: HomeService) {
    }
    @Output() GotoNextPage = new EventEmitter();
    @Output() GotoPreviousPage = new EventEmitter();
    groupInfo1: IClassInfo;
    groupInfo2: IClassInfo;
    ChinaMax1 = 100;
    ZheJiangMax1 = 100;
    ChinaMax2 = 100;
    ZheJiangMax2 = 100;
    IsShowMap = false;
    Graphoption1: any = {};
    Graphoption2: any = {};
    ngOnInit(): void {
        this.groupInfo1 = this.service.FilterDataClassInfo;
        this.groupInfo2 = this.service.FilterDataClassInfo_2;

        let m = this.groupInfo1.property.nativePlace.map(x => x.value);
        m = m.sort(CommonFunction.NumberSortMethod);
        this.ChinaMax1 = m[m.length - 1];

        m = this.groupInfo1.property.nativePlaceZheJiang.map(x => x.value);
        m = m.sort(CommonFunction.NumberSortMethod);
        this.ZheJiangMax1 = m[m.length - 1];

        this.GraphName = "性别比例";
        this.Graphoption1 = CommonFunction.clone(SexRatePieOption);
        this.Graphoption1.title.text = this.GraphName;
        this.Graphoption1.title['show'] = false;
        this.Graphoption1.legend.data = ["男", "女"];
        this.Graphoption1.series[0].data[0].value = this.groupInfo1.property.sexRate.posCnt;
        this.Graphoption1.series[0].data[1].value = this.groupInfo1.property.sexRate.negCnt;
        
        if (this.groupInfo2 !== null){
 
            m = this.groupInfo2.property.nativePlace.map(x => x.value);
            m = m.sort(CommonFunction.NumberSortMethod);
            this.ChinaMax2 = m[m.length - 1];
    
            m = this.groupInfo2.property.nativePlaceZheJiang.map(x => x.value);
            m = m.sort(CommonFunction.NumberSortMethod);
            this.ZheJiangMax2 = m[m.length - 1];
    
            this.Graphoption2 = CommonFunction.clone(SexRatePieOption);
            this.Graphoption2.title.text = this.GraphName;
            this.Graphoption2.title['show'] = false;
            this.Graphoption2.legend.data = ["男", "女"];
            this.Graphoption2.series[0].data[0].value = this.groupInfo2.property.sexRate.posCnt;
            this.Graphoption2.series[0].data[1].value = this.groupInfo2.property.sexRate.negCnt;
        }

    }

    GraphName = "";
    EchartsInstance: any;
    onChartInit(event: any) {
        //console.log("onChartInit")
        this.EchartsInstance = event;
    }

    EchartsInstance_2: any;
    onChart2Init(event: any) {
        this.EchartsInstance_2 = event;
    }

    GraphTypeList = [
        { label: '性别比例（饼图）', value: 'SexRate' },
        { label: '住宿比例（饼图）', value: 'LiveAtSchoolRate' },
        { label: '浙江省比例（饼图）', value: 'IsZheJiangRate' },
        { label: '考勤（柱状图）', value: 'kaoqin' },
        { label: '月度消费（柱状图）', value: 'monthlyConsumption' },
        { label: '周次消费（柱状图）', value: 'weeklyConsumption' },
        { label: '地图', value: 'Map' },
    ]
    SelectGraphType = "SexRate";

    GraphTypeChanged() {
        this.IsShowMap = false;
        switch (this.SelectGraphType) {
            case "Map":
                this.IsShowMap = true;
                break;
            case "SexRate":
                this.CreateGraphSexRate(this.EchartsInstance, this.groupInfo1);
                if (this.groupInfo2 !== null) this.CreateGraphSexRate(this.EchartsInstance_2, this.groupInfo2);
                break;
            case "LiveAtSchoolRate":
                this.CreateGraphLiveAtSchoolRate(this.EchartsInstance, this.groupInfo1);
                if (this.groupInfo2 !== null) this.CreateGraphLiveAtSchoolRate(this.EchartsInstance_2, this.groupInfo2);
                break;
            case "IsZheJiangRate":
                this.CreateGraphZheJiangRate(this.EchartsInstance, this.groupInfo1);
                if (this.groupInfo2 !== null) this.CreateGraphZheJiangRate(this.EchartsInstance_2, this.groupInfo2);
                break;
            case "kaoqin":
                this.CreateGraphKaoqin(this.EchartsInstance, this.groupInfo1);
                if (this.groupInfo2 !== null) this.CreateGraphKaoqin(this.EchartsInstance_2, this.groupInfo2);
                break;
            case "monthlyConsumption":
                this.CreateGraphMonthlyConsumption(this.EchartsInstance, this.groupInfo1);
                if (this.groupInfo2 !== null) this.CreateGraphMonthlyConsumption(this.EchartsInstance_2, this.groupInfo2);
                break;
            case "weeklyConsumption":
                this.CreateGraphWeeklyConsumption(this.EchartsInstance, this.groupInfo1);
                if (this.groupInfo2 !== null) this.CreateGraphWeeklyConsumption(this.EchartsInstance_2, this.groupInfo2);
                break;
            default:
                break;
        }
    }


    //各种图标的动态生成区
    CreateGraphSexRate(instance: any, groupInfo: IClassInfo, option?: any) {
        let x = CommonFunction.clone(SexRatePieOption);
        this.GraphName = "性别比例";
        x.title.text = this.GraphName;
        x.title['show'] = false;
        x.legend.data = ["男", "女"];
        x.series[0].data[0].value = groupInfo.property.sexRate.posCnt;
        x.series[0].data[1].value = groupInfo.property.sexRate.negCnt;
        if (instance !== undefined) {
            instance.clear();
            instance.setOption(x);
        }
    }

    CreateGraphLiveAtSchoolRate(instance: any, groupInfo: IClassInfo) {
        let x = CommonFunction.clone(SexRatePieOption);
        this.GraphName = "住校比例";
        x.title.text = this.GraphName;
        x.title['show'] = false;
        x.legend.data = ["住校", "不住校"];
        x.series[0].data[0].value = groupInfo.property.liveAtSchoolRate.posCnt;
        x.series[0].data[0].name = "住校";
        x.series[0].data[1].value = groupInfo.property.liveAtSchoolRate.negCnt;
        x.series[0].data[1].name = "不住校";
        if (instance !== undefined) {
            instance.clear();
            instance.setOption(x);
        }
    }

    CreateGraphZheJiangRate(instance: any, groupInfo: IClassInfo) {
        let x = CommonFunction.clone(SexRatePieOption);
        this.GraphName = "浙江省比例";
        x.title.text = this.GraphName;
        x.title['show'] = false;
        x.legend.data = ["浙江省", "浙江省以外"];
        x.series[0].data[0].value = groupInfo.property.zheJiangRate.posCnt;
        x.series[0].data[0].name = "浙江省";
        x.series[0].data[1].value = groupInfo.property.zheJiangRate.negCnt;
        x.series[0].data[1].name = "浙江省以外";
        if (instance !== undefined) {
            instance.clear();
            instance.setOption(x);
        }
    }

    CreateGraphKaoqin(instance: any, groupInfo: IClassInfo) {
        this.GraphName = "考勤统计";
        let x = {
            xAxis: {
                type: 'category',
                data: groupInfo.kaoqing.map(x => x.name)
            },
            title: {
                text: "考勤统计"
            },
            toolbox: ToolboxForBar,
            yAxis: {
                type: 'value'
            },
            series: [{
                label: {
                    normal: {
                        show: true
                    }
                },
                data: groupInfo.kaoqing.map(x => x.value),
                type: 'bar'
            }]
        };
        x.title['show'] = false;
        if (instance !== undefined) {
            instance.clear();
            instance.setOption(x);
        }
    }

    CreateGraphMonthlyConsumption(instance: any, groupInfo: IClassInfo) {
        this.GraphName = "整体月消费金额";
        let x = CommonFunction.clone(MonthlyCompumptionBarOptionTotal);
        x.title.text = "整体月消费金额";
        x.xAxis.data = groupInfo.monthlyConsumption.map(x => x.name);
        x.series[0].data = groupInfo.monthlyConsumption;
        x.title['show'] = false;
        if (instance !== undefined) {
            instance.clear();
            instance.setOption(x);
        }
    }

    CreateGraphWeeklyConsumption(instance: any, groupInfo: IClassInfo) {
        this.GraphName = "周别消费";
        let x = CommonFunction.clone(MonthlyCompumptionBarOptionTotal);
        x.title.text = "周别消费";
        x.xAxis.data = groupInfo.weeklyConsumption.map(x => x.name);
        x.series[0].data = groupInfo.weeklyConsumption;
        x.title['show'] = false;
        if (instance !== undefined) {
            instance.clear();
            instance.setOption(x);
        }
    }
}