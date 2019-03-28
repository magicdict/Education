import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ISunburstOption, ILeaf, IStackBarOption, IStack } from '../../GraphOption/KaoqinOption';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from '../../Common/common';
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

    ngOnInit(): void {
        this.route.data
            .subscribe((data: { kaoqinInfo: IKaoqinOverview }) => {
                let totalcnt = 0;
                let totalcnt_1 = 0;
                let totalcnt_2 = 0;
                let totalcnt_3 = 0;
                let totalcnt_9 = 0;


                let leaf: ILeaf = {
                    name: "次数",
                    value: 9999,
                    children: []
                };

                let leaf_1: ILeaf = {
                    name: "迟到_晚到",
                    value: 9999,
                    children: []
                };
                let leaf_2: ILeaf = {
                    name: "校徽_早退",
                    value: 9999,
                    children: []
                };
                let leaf_3: ILeaf = {
                    name: "操场考勤机",
                    value: 9999,
                    children: []
                };
                let leaf_9: ILeaf = {
                    name: "移动考勤机",
                    value: 9999,
                    children: []
                };

                for (let k in data.kaoqinInfo.overviewDict) {
                    let mleaf: ILeaf = {
                        name: data.kaoqinInfo.overviewDict[k].name,
                        value: data.kaoqinInfo.overviewDict[k].value,
                    };
                    if (k.startsWith("1")) {
                        totalcnt_1 += data.kaoqinInfo.overviewDict[k].value;
                        leaf_1.children.push(mleaf);
                    }
                    if (k.startsWith("2")) {
                        totalcnt_2 += data.kaoqinInfo.overviewDict[k].value;
                        leaf_2.children.push(mleaf);
                    }
                    if (k.startsWith("3")) {
                        totalcnt_3 += data.kaoqinInfo.overviewDict[k].value;
                        leaf_3.children.push(mleaf);
                    }
                    if (k.startsWith("9")) {
                        totalcnt_9 += data.kaoqinInfo.overviewDict[k].value;
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
                    series: { data: [leaf], type: "sunburst" }
                }

                var NameArray:string[] = ["默认信息", "早上迟到", "晚到学校"];
                var CodeArray:string[] = ["100000", "100100", "100200"];
                var StackName:string = "迟到_晚到";
                this.Kaoqin10MonthOption = this.CreateOption(NameArray,CodeArray,StackName,data);


                var NameArray:string[] = ["校徽校服", "请假离校"];
                var CodeArray:string[] = ["200100", "200200"];
                var StackName:string = "校徽_早退";
                this.Kaoqin20MonthOption = this.CreateOption(NameArray,CodeArray,StackName,data);

                var NameArray:string[] = ["默认信息", "住宿早晨锻炼","课间操请假"];
                var CodeArray:string[] = ["300000", "300100","300200"];
                var StackName:string = "操场考勤机";
                this.Kaoqin30MonthOption = this.CreateOption(NameArray,CodeArray,StackName,data);


                var NameArray:string[] = ["迟到", "校服", "早退", "离校", "进校"];
                var CodeArray:string[] = ["9900100", "9900200", "9900300", "9900400", "9900500"];
                var StackName:string = "移动考勤机";
                this.Kaoqin99MonthOption = this.CreateOption(NameArray,CodeArray,StackName,data);


            });
    }

    CreateOption(NameArray:string[],CodeArray:string[],StackName:string,data: { kaoqinInfo: IKaoqinOverview }):IStackBarOption {
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
                data: data.kaoqinInfo.monthDict[CodeArray[index]],
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
            label: {
                formatter: '{b}:\n{c}'
            },
            xAxis: {
                type: 'category',
                data: data.kaoqinInfo.monthDict[CodeArray[0]].map(x => x.name)
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
        return KaoqinMonthOption;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private commonFunction: CommonFunction,
        public service: HomeService
    ) { }
} 