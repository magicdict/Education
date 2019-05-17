import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { IStudentGroupProperty } from '../Common/Education.model';
import { CommonFunction } from '../Common/common';
import { SexRatePieOption } from '../GraphOption/StudentGraphOption';
@Component({
    selector: "visual-factory",
    templateUrl: 'VisualFactory.html',
})
export class VisualFactoryComponent implements OnInit {

    constructor(
        private service: HomeService) {

    }
    groupInfo: IStudentGroupProperty;
    ChinaMax = 100;
    ZheJiangMax = 100;
    ngOnInit(): void {
        this.groupInfo = this.service.FilterDataGroupProperty;

        let m = this.groupInfo.nativePlace.map(x => x.value);
        m = m.sort(CommonFunction.NumberSortMethod);
        this.ChinaMax = m[m.length - 1];

        m = this.groupInfo.nativePlaceZheJiang.map(x => x.value);
        m = m.sort(CommonFunction.NumberSortMethod);
        this.ZheJiangMax = m[m.length - 1];
        this.CreateGraphSexRate();
    }


    GraphTypeList = [
        { label: '性别比例（饼图）', value: 'SexRate' },
        { label: '住宿比例（饼图）', value: 'LiveAtSchoolRate' },
        { label: '浙江省比例（饼图）', value: 'IsZheJiangRate' },
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
        x.series[0].data[0].value = this.groupInfo.sexRate.posCnt;
        x.series[0].data[1].value = this.groupInfo.sexRate.negCnt;
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
        x.series[0].data[0].value = this.groupInfo.liveAtSchoolRate.posCnt;
        x.series[0].data[0].name = "住校";
        x.series[0].data[1].value = this.groupInfo.liveAtSchoolRate.negCnt;
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
        x.series[0].data[0].value = this.groupInfo.zheJiangRate.posCnt;
        x.series[0].data[0].name = "浙江省";
        x.series[0].data[1].value = this.groupInfo.zheJiangRate.negCnt;
        x.series[0].data[1].name = "浙江省以外";

        this.Graphoption = x;
        if (this.EchartsInstance !== undefined) {
            this.EchartsInstance.setOption(this.Graphoption);
        }
    }

    @Output() GotoNextPage = new EventEmitter();
    @Output() GotoPreviousPage = new EventEmitter();
}