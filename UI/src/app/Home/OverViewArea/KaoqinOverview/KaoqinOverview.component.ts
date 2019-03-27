import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Common/Home.service';
import { ISunburstOption, ILeaf } from '../../GraphOption/KaoqinOption';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from '../../Common/common';
import { IKaoqinOverview } from '../../Common/Education.model';

@Component({
    templateUrl: 'KaoqinOverview.html',
})
export class KaoqinOverviewComponent implements OnInit {

    KaoqinOption: ISunburstOption;

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

                for (let k in data.kaoqinInfo) {
                    let mleaf: ILeaf = {
                        name: data.kaoqinInfo[k].name,
                        value: data.kaoqinInfo[k].value,
                    };
                    if (k.startsWith("1")) {
                        totalcnt_1 += data.kaoqinInfo[k].value;
                        leaf_1.children.push(mleaf);
                    }
                    if (k.startsWith("2")) {
                        totalcnt_2 += data.kaoqinInfo[k].value;
                        leaf_2.children.push(mleaf);
                    }
                    if (k.startsWith("3")) {
                        totalcnt_3 += data.kaoqinInfo[k].value;
                        leaf_3.children.push(mleaf);
                    }
                    if (k.startsWith("9")) {
                        totalcnt_9 += data.kaoqinInfo[k].value;
                        leaf_9.children.push(mleaf);
                    }
                    totalcnt += data.kaoqinInfo[k].value;
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
            });
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private commonFunction: CommonFunction,
        public service: HomeService
    ) { }
} 