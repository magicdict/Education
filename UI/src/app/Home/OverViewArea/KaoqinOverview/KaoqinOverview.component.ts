import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ISunburstOption, ILeaf, IStackBarOption, IStack, ToolboxSaveImageOnly, ToolboxForBar } from '../../GraphOption/KaoqinOption';
import { ActivatedRoute } from '@angular/router';
import { IKaoqinOverview } from '../../Common/Education.model';
import { CommonFunction } from '../../Common/common';
import { MonthlyCompumptionBarOption } from '../../GraphOption/CompumptionOption';

@Component({
    templateUrl: 'KaoqinOverview.html',
})
export class KaoqinOverviewComponent implements OnInit {

    KaoqinOption: ISunburstOption;
    Kaoqin10MonthOption: IStackBarOption;
    Kaoqin20MonthOption: IStackBarOption;
    Kaoqin30MonthOption: IStackBarOption;
    Kaoqin99MonthOption: IStackBarOption;
    KaoqinAbnormalMonthOption: IStackBarOption;
    KaoqinDateList: { key: string, catalog: string, value: number }[] = [];
    SexCntOption = CommonFunction.clone(MonthlyCompumptionBarOption);
    LiveAtSchoolCntOption = CommonFunction.clone(MonthlyCompumptionBarOption);

    ngOnInit(): void {
        this.route.data
            .subscribe((data: { kaoqinInfo: IKaoqinOverview }) => {

                for (let k in data.kaoqinInfo.overviewDict) {
                    if (k === "100000") {
                        this.KaoqinDateList.push({ 'key': k, 'catalog': '迟到_晚到', 'value': 0 })
                    }
                    if (k === "200100") {
                        this.KaoqinDateList.push({ 'key': k, 'catalog': '校徽_早退', 'value': 0 })
                    }
                    if (k === "300000") {
                        this.KaoqinDateList.push({ 'key': k, 'catalog': '操场考勤机', 'value': 0 })
                    }
                    if (k === "9900100") {
                        this.KaoqinDateList.push({ 'key': k, 'catalog': '移动考勤机', 'value': 0 })
                    }
                    this.KaoqinDateList.push({ 'key': k, 'catalog': data.kaoqinInfo.overviewDict[k].name, 'value': data.kaoqinInfo.overviewDict[k].value })
                };
                let totalcnt = 0;
                let totalcnt_1 = 0;
                let totalcnt_2 = 0;
                let totalcnt_3 = 0;
                let totalcnt_9 = 0;

                let leaf: ILeaf = {
                    name: "次数",
                    value: 9999,
                    itemStyle: {
                        color: "#ca8622"
                    },
                    children: []

                };

                let leaf_1: ILeaf = {
                    name: "迟到_晚到",
                    value: 9999,
                    itemStyle: {
                        color: '#2f4554'
                    },
                    children: []
                };
                let leaf_2: ILeaf = {
                    name: "校徽_早退",
                    value: 9999,
                    itemStyle: {
                        color: '#61a0a8'
                    },
                    children: []
                };
                let leaf_3: ILeaf = {
                    name: "操场考勤机",
                    value: 9999,
                    itemStyle: {
                        color: '#d48265'
                    },
                    children: []
                };
                let leaf_9: ILeaf = {
                    name: "移动考勤机",
                    value: 9999,
                    itemStyle: {
                        color: '#91c7ae'
                    },
                    children: []
                };

                var color = ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', "#96dee8"]
                let color1 = 0;
                let color2 = 0;
                let color3 = 0;
                let color9 = 0;
                for (let k in data.kaoqinInfo.overviewDict) {
                    let mleaf: ILeaf = {
                        name: data.kaoqinInfo.overviewDict[k].name,
                        value: data.kaoqinInfo.overviewDict[k].value,
                        itemStyle: {
                            color: ""
                        }
                    };
                    if (k.startsWith("1")) {
                        totalcnt_1 += data.kaoqinInfo.overviewDict[k].value;
                        mleaf.itemStyle.color = color[color1];
                        color1++;
                        leaf_1.children.push(mleaf);
                    }
                    if (k.startsWith("2")) {
                        totalcnt_2 += data.kaoqinInfo.overviewDict[k].value;
                        mleaf.itemStyle.color = color[color2];
                        color2++;
                        leaf_2.children.push(mleaf);
                    }
                    if (k.startsWith("3")) {
                        totalcnt_3 += data.kaoqinInfo.overviewDict[k].value;
                        mleaf.itemStyle.color = color[color3];
                        color3++;
                        leaf_3.children.push(mleaf);
                    }
                    if (k.startsWith("9")) {
                        totalcnt_9 += data.kaoqinInfo.overviewDict[k].value;
                        mleaf.itemStyle.color = color[color9];
                        color9++;
                        leaf_9.children.push(mleaf);
                    }
                    totalcnt += data.kaoqinInfo.overviewDict[k].value;
                }

                leaf_1.value = totalcnt_1;
                leaf_2.value = totalcnt_2;
                leaf_3.value = totalcnt_3;
                leaf_9.value = totalcnt_9;

                leaf.value = totalcnt;
                leaf.children.push(leaf_1);
                leaf.children.push(leaf_2);
                leaf.children.push(leaf_3);
                leaf.children.push(leaf_9);

                this.KaoqinOption = {
                    tooltip: {},
                    toolbox: CommonFunction.clone(ToolboxSaveImageOnly),
                    title: { text: "考勤次数", left: 10 },
                    label: { formatter: "{b}\n{c}" },
                    series: { data: [leaf], type: "sunburst", center: ["40%", "50%"] },
                }
                this.KaoqinOption.toolbox['left'] = 600;    //这里会修改toolbox，必须Clone一个！
                var NameArray: string[] = ["默认信息", "早上迟到", "晚到学校"];
                var CodeArray: string[] = ["100000", "100100", "100200"];
                var StackName: string = "迟到_晚到";
                this.Kaoqin10MonthOption = this.CreateOption(NameArray, CodeArray, StackName, data.kaoqinInfo.monthDict);


                var NameArray: string[] = ["校徽校服", "请假离校"];
                var CodeArray: string[] = ["200100", "200200"];
                var StackName: string = "校徽_早退";
                this.Kaoqin20MonthOption = this.CreateOption(NameArray, CodeArray, StackName, data.kaoqinInfo.monthDict);

                var NameArray: string[] = ["默认信息", "住宿早晨锻炼", "课间操请假"];
                var CodeArray: string[] = ["300000", "300100", "300200"];
                var StackName: string = "操场考勤机";
                this.Kaoqin30MonthOption = this.CreateOption(NameArray, CodeArray, StackName, data.kaoqinInfo.monthDict);


                var NameArray: string[] = ["迟到", "校服", "早退", "离校", "进校"];
                var CodeArray: string[] = ["9900100", "9900200", "9900300", "9900400", "9900500"];
                var StackName: string = "移动考勤机";
                this.Kaoqin99MonthOption = this.CreateOption(NameArray, CodeArray, StackName, data.kaoqinInfo.monthDict);


                //对于违规考勤的统计
                var NameArray: string[] = ["早上迟到", "晚到学校", "迟到", "校服", "早退", "校徽校服"];
                var CodeArray: string[] = ["100100", "100200", "9900100", "9900200", "9900300", "200100"];
                var StackName: string = "违规行为";
                //各个考勤记录范围不同，需要对于日期重新清洗    
                let Monthlist: string[] = [];
                CodeArray.forEach(
                    code => {
                        data.kaoqinInfo.monthDict[code].forEach(
                            month => {
                                if (Monthlist.indexOf(month.name) === -1 && month.value > 0) {
                                    Monthlist.push(month.name);
                                }
                            }
                        );
                    }
                );
                Monthlist.sort();
                let dataSet: { [key: string]: { name: string, value: number }[] } = {};
                CodeArray.forEach(code => {
                    let monthcnt: { name: string, value: number }[] = [];
                    Monthlist.forEach(
                        month => {
                            let cnt = data.kaoqinInfo.monthDict[code].find(x => x.name == month);
                            if (cnt === undefined) {
                                monthcnt.push({ name: month, value: 0 });
                            } else {
                                monthcnt.push(cnt);
                            }
                        }
                    );
                    dataSet[code] = monthcnt;
                });
                this.KaoqinAbnormalMonthOption = this.CreateOption(NameArray, CodeArray, StackName, dataSet, Monthlist);

                this.SexCntOption.title.text = "考勤性别比";
                this.SexCntOption.legend.data = ["男", "女"];
                this.SexCntOption.xAxis.data = data.kaoqinInfo.kaoqingMale.map(x => x.name);
                this.SexCntOption.series[0].data = data.kaoqinInfo.kaoqingMale;
                this.SexCntOption.series[0].name = "男";
                this.SexCntOption.series[1].data = data.kaoqinInfo.kaoqingFeMale;
                this.SexCntOption.series[1].name = "女";
                this.SexCntOption.toolbox.feature.magicType.type = ['line', 'bar', 'stack', 'tiled'];

                this.LiveAtSchoolCntOption.title.text = "考勤住校比";
                this.LiveAtSchoolCntOption.legend.data = ["住校", "非住校"];
                this.LiveAtSchoolCntOption.xAxis.data = data.kaoqinInfo.kaoqingMale.map(x => x.name);
                this.LiveAtSchoolCntOption.series[0].data = data.kaoqinInfo.kaoqingLiveAtSchool;
                this.LiveAtSchoolCntOption.series[1].data = data.kaoqinInfo.kaoqingNotLiveAtSchool;
                this.LiveAtSchoolCntOption.toolbox.feature.magicType.type = ['line', 'bar', 'stack', 'tiled'];

                //Minute
                this.MinuteFrom6.angleAxis.data = data.kaoqinInfo.minuteList.slice(360, 480);
                this.MinuteFrom6.title.text = "早高峰考勤";
                this.MinuteFrom6.series[0].data = data.kaoqinInfo.timePolar0099001.map(x => x.value).slice(360, 480);
                this.MinuteFrom6.series[1].data = data.kaoqinInfo.timePolar0099002.map(x => x.value).slice(360, 480);
                this.MinuteFrom6.series[2].data = data.kaoqinInfo.timePolar0099003.map(x => x.value).slice(360, 480);
                this.MinuteFrom6.series[3].data = data.kaoqinInfo.timePolar0099004.map(x => x.value).slice(360, 480);
                this.MinuteFrom6.series[4].data = data.kaoqinInfo.timePolar0099005.map(x => x.value).slice(360, 480);


                this.MinuteFrom11.angleAxis.data = data.kaoqinInfo.minuteList.slice(660, 780);
                this.MinuteFrom11.title.text = "午高峰考勤";
                this.MinuteFrom11.series[0].data = data.kaoqinInfo.timePolar0099001.map(x => x.value).slice(660, 780);
                this.MinuteFrom11.series[1].data = data.kaoqinInfo.timePolar0099002.map(x => x.value).slice(660, 780);
                this.MinuteFrom11.series[2].data = data.kaoqinInfo.timePolar0099003.map(x => x.value).slice(660, 780);
                this.MinuteFrom11.series[3].data = data.kaoqinInfo.timePolar0099004.map(x => x.value).slice(660, 780);
                this.MinuteFrom11.series[4].data = data.kaoqinInfo.timePolar0099005.map(x => x.value).slice(660, 780);

                this.MinuteFrom16.angleAxis.data = data.kaoqinInfo.minuteList.slice(960, 1080);
                this.MinuteFrom16.title.text = "晚高峰考勤";
                this.MinuteFrom16.series[0].data = data.kaoqinInfo.timePolar0099001.map(x => x.value).slice(960, 1080);
                this.MinuteFrom16.series[1].data = data.kaoqinInfo.timePolar0099002.map(x => x.value).slice(960, 1080);
                this.MinuteFrom16.series[2].data = data.kaoqinInfo.timePolar0099003.map(x => x.value).slice(960, 1080);
                this.MinuteFrom16.series[3].data = data.kaoqinInfo.timePolar0099004.map(x => x.value).slice(960, 1080);
                this.MinuteFrom16.series[4].data = data.kaoqinInfo.timePolar0099005.map(x => x.value).slice(960, 1080);


                //TimeLine设定 201401 - 201901
                var TimeLineMonthArray = [];
                for (const key in data.kaoqinInfo.monthDict) {
                    if (data.kaoqinInfo.monthDict.hasOwnProperty(key)) {
                        const element = data.kaoqinInfo.monthDict[key];
                        element.forEach(
                            r => {
                                if (TimeLineMonthArray.indexOf(r.name) === -1) {
                                    TimeLineMonthArray.push(r.name);
                                }
                            }
                        )
                    }
                }
                this.TimeLineOption.baseOption.timeline.data = TimeLineMonthArray;

                //数据准备
                TimeLineMonthArray.forEach(
                    Month => {
                        let xAxis = [];
                        let series = [];

                        for (const key in data.kaoqinInfo.monthDict) {
                            if (data.kaoqinInfo.monthDict.hasOwnProperty(key)) {
                                const element = data.kaoqinInfo.monthDict[key];
                                element.forEach(
                                    r => {
                                        if (r.value !== 0 && r.name == Month) {
                                            xAxis.push(data.kaoqinInfo.overviewDict[key].name);
                                            series.push(r.value);
                                        }
                                    }
                                )
                            }
                        }


                        let opt = {
                            title: {
                                text: '考勤历史数据 ' + Month,
                                show: true
                            },
                            xAxis: {
                                data: xAxis
                            },
                            series: {
                                type: 'bar',
                                data: series,
                            }
                        }
                        this.TimeLineOption.options.push(opt);
                    }
                );
            });
    }

    CreateOption(NameArray: string[], CodeArray: string[],
        StackName: string, data: { [key: string]: { name: string, value: number }[] },
        Monthlist?: string[]): IStackBarOption {
        var StackArray: IStack[] = [];
        for (let index = 0; index < NameArray.length; index++) {
            let stack: IStack = {
                label: {
                    normal: {
                        show: true
                    }
                },
                name: NameArray[index],
                stack: StackName,
                data: data[CodeArray[index]],
                type: 'bar'
            }
            StackArray.push(stack)
        }

        let KaoqinMonthOption = {
            toolbox: CommonFunction.clone(ToolboxForBar),
            title: {
                text: StackName,
            },
            legend: {
                data: NameArray,
                top:25
            },
            tooltip: {
                //默认的就往往就是是最好的！
            },
            label: {
                formatter: function (a) {
                    if (a.value > 0) {
                        return (a.value)
                    }
                    return '';
                }
            },
            xAxis: {
                type: 'category',
                data: data[CodeArray[0]].map(x => x.name)
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: {
                show: true,
                realtime: true,
                start: 10,
                end: 90
            },
            series: StackArray
        }

        if (Monthlist !== undefined) {
            KaoqinMonthOption.xAxis.data = Monthlist;
        }
        KaoqinMonthOption.toolbox.feature.magicType.type = ['line', 'bar', 'stack', 'tiled'];
        return KaoqinMonthOption;
    }

    constructor(
        private route: ActivatedRoute,
        public service: HomeService
    ) { }


    TimeLineOption = {
        baseOption: {
            timeline: {
                axisType: 'category',
                orient: 'vertical',
                autoPlay: true,
                inverse: true,
                playInterval: 2000,
                left: null,
                right: 0,
                top: 20,
                bottom: 20,
                width: 55,
                height: null,
                label: {
                    normal: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                symbol: 'none',
                lineStyle: {
                    color: '#555'
                },
                checkpointStyle: {
                    color: '#bbb',
                    borderColor: '#777',
                    borderWidth: 2
                },
                controlStyle: {
                    showNextBtn: false,
                    showPrevBtn: false,
                    normal: {
                        color: '#666',
                        borderColor: '#666'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
                data: []
            },
            tooltip: {},
            title:
            {
                text: '考勤历史数据',
                left: 'center',
                top: 10,
                textStyle: {
                    color: '#aaa',
                    fontWeight: 'normal',
                    fontSize: 20
                }
            },
            grid: {
                top: 100,
                containLabel: true,
                left: 30,
                right: '110'
            },
            xAxis: {
                type: 'category',
                name: '类型',
            },
            yAxis: {
                type: 'value',
                name: '次数',
            },
            series: [
                {
                    type: 'bar',
                    data: [],
                }
            ],
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'quinticInOut'
        },
        options: [
        ]
    };

    HourMinuteOption = {
        angleAxis: {
            type: 'category',
            data: [],
            z: 10,
            interval: 50
        },
        title: {
            text: ""
        },
        toolbox: ToolboxSaveImageOnly,
        tooltip: {},
        radiusAxis: {
        },
        polar: {
        },
        series: [{
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '迟到',
            stack: 'kaoqin'
        }, {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '校服',
            stack: 'kaoqin'
        }, {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '早退',
            stack: 'kaoqin'
        }, {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '离校',
            stack: 'kaoqin'
        }, {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: '进校',
            stack: 'kaoqin'
        }],
        legend: {
            show: true,
            top: 30,
            data: ['迟到', '校服', '早退', "离校", "进校"]
        }
    };

    MinuteFrom6 = CommonFunction.clone(this.HourMinuteOption);
    MinuteFrom11 = CommonFunction.clone(this.HourMinuteOption);
    MinuteFrom16 = CommonFunction.clone(this.HourMinuteOption);


} 