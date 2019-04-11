import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ISunburstOption, ILeaf, IStackBarOption, IStack } from '../../GraphOption/KaoqinOption';
import { ActivatedRoute } from '@angular/router';
import { IKaoqinOverview } from '../../Common/Education.model';

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
                    title: { text: "考勤次数", left: 10 },
                    label: { formatter: "{b}\n{c}" },
                    series: { data: [leaf], type: "sunburst", center: ["40%", "50%"] },
                }

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
            });
    }

    CreateOption(NameArray: string[], CodeArray: string[], StackName: string, data: { [key: string]: { name: string, value: number }[] }, Monthlist?: string[]): IStackBarOption {
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
            title: {
                text: StackName,
            },
            legend: {
                data: NameArray
            },
            tooltip : {
                //默认的就往往就是是最好的！
            },
            label: {
                formatter: function(a)
                {
                    if (a.value > 0){
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

        return KaoqinMonthOption;
    }

    constructor(
        private route: ActivatedRoute,
        public service: HomeService
    ) { }
} 