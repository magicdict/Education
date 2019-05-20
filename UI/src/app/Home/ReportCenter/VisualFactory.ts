import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { IClassInfo } from '../Common/Education.model';
import { CommonFunction } from '../Common/common';
import { SexRatePieOption } from '../GraphOption/StudentGraphOption';
import { ToolboxSaveImageOnly, ToolboxForBar } from '../GraphOption/KaoqinOption';
import { MonthlyCompumptionBarOptionTotal } from '../GraphOption/CompumptionOption';
@Component({
    selector: "visual-factory",
    templateUrl: 'VisualFactory.html',
})
export class VisualFactoryComponent implements OnInit {

    constructor(
        private service: HomeService) {

    }
    groupInfo: IClassInfo;
    ChinaMax = 100;
    ZheJiangMax = 100;
    ngOnInit(): void {
        this.groupInfo = this.service.FilterDataClassInfo;

        let m = this.groupInfo.property.nativePlace.map(x => x.value);
        m = m.sort(CommonFunction.NumberSortMethod);
        this.ChinaMax = m[m.length - 1];

        m = this.groupInfo.property.nativePlaceZheJiang.map(x => x.value);
        m = m.sort(CommonFunction.NumberSortMethod);
        this.ZheJiangMax = m[m.length - 1];
        this.CreateGraphSexRate();
    }


    GraphTypeList = [
        { label: '性别比例（饼图）', value: 'SexRate' },
        { label: '住宿比例（饼图）', value: 'LiveAtSchoolRate' },
        { label: '浙江省比例（饼图）', value: 'IsZheJiangRate' },
        { label: '考勤（柱状图）', value: 'kaoqin' },
        { label: '月度消费（柱状图）', value: 'monthlyConsumption' },
        { label: '周次消费（柱状图）', value: 'weeklyConsumption' },
    ]
    SelectGraphType = "SexRate";
    GraphTypeChanged() {
        switch (this.SelectGraphType) {
            case "SexRate":
                this.CreateGraphSexRate();
                break;
            case "LiveAtSchoolRate":
                this.CreateGraphLiveAtSchoolRate();
                break;
            case "IsZheJiangRate":
                this.CreateGraphZheJiangRate();
                break;
            case "kaoqin":
                this.CreateGraphKaoqin();
                break;
            case "monthlyConsumption":
                this.CreateGraphMonthlyConsumption();
                break;
            case "weeklyConsumption":
                this.CreateGraphWeeklyConsumption();
                break;

            default:
                break;
        }
    }

    Graphoption: any = {};
    GraphName = "";
    EchartsInstance: any;
    onChartInit(event: any) {
        this.EchartsInstance = event;
    }
    //各种图标的动态生成区
    CreateGraphSexRate() {
        let x = CommonFunction.clone(SexRatePieOption);
        this.GraphName = "性别比例";
        x.title.text = this.GraphName;
        x.title['show'] = false;
        x.legend.data = ["男", "女"];
        x.series[0].data[0].value = this.groupInfo.property.sexRate.posCnt;
        x.series[0].data[1].value = this.groupInfo.property.sexRate.negCnt;
        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }
    }

    CreateGraphLiveAtSchoolRate() {
        let x = CommonFunction.clone(SexRatePieOption);
        this.GraphName = "住校比例";
        x.title.text = this.GraphName;
        x.title['show'] = false;
        x.legend.data = ["住校", "不住校"];
        x.series[0].data[0].value = this.groupInfo.property.liveAtSchoolRate.posCnt;
        x.series[0].data[0].name = "住校";
        x.series[0].data[1].value = this.groupInfo.property.liveAtSchoolRate.negCnt;
        x.series[0].data[1].name = "不住校";

        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }
    }

    CreateGraphZheJiangRate() {
        let x = CommonFunction.clone(SexRatePieOption);
        this.GraphName = "浙江省比例";
        x.title.text = this.GraphName;
        x.title['show'] = false;
        x.legend.data = ["浙江省", "浙江省以外"];
        x.series[0].data[0].value = this.groupInfo.property.zheJiangRate.posCnt;
        x.series[0].data[0].name = "浙江省";
        x.series[0].data[1].value = this.groupInfo.property.zheJiangRate.negCnt;
        x.series[0].data[1].name = "浙江省以外";

        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }
    }

    CreateGraphKaoqin() {
        this.GraphName = "考勤统计";
        let x = {
            xAxis: {
                type: 'category',
                data: this.groupInfo.kaoqing.map(x => x.name)
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
                data: this.groupInfo.kaoqing.map(x => x.value),
                type: 'bar'
            }]
        };
        x.title['show'] = false;
        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }
    }

    CreateGraphMonthlyConsumption() {
        this.GraphName = "整体月消费金额";
        let x = CommonFunction.clone(MonthlyCompumptionBarOptionTotal);
        x.title.text = "整体月消费金额";
        x.xAxis.data = this.groupInfo.monthlyConsumption.map(x => x.name);
        x.series[0].data = this.groupInfo.monthlyConsumption;
        x.title['show'] = false;
        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }
    }

    CreateGraphWeeklyConsumption() {
        this.GraphName = "周别消费";
        let x = CommonFunction.clone(MonthlyCompumptionBarOptionTotal);
        x.title.text = "周别消费";
        x.xAxis.data = this.groupInfo.weeklyConsumption.map(x => x.name);
        x.series[0].data = this.groupInfo.weeklyConsumption;
        x.title['show'] = false;
        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }

    }

    @Output() GotoNextPage = new EventEmitter();
    @Output() GotoPreviousPage = new EventEmitter();
}