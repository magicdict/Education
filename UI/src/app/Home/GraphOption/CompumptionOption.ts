import { ToolboxForBar } from './KaoqinOption';

export const DiaryAvgByTimeRangeOption = {
    title: {
        text: '按照时段统计每日平均消费',
        subtext: '10点之前，16点之前，24点之前',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    toolbox: {
        'show': true,
        'feature': {
            'saveAsImage': {},
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['10点之前', '16点之前', '24点之前']
    },
    series: [
        {
            name: '每日平均消费',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                { value: 0, name: '10点之前' },
                { value: 0, name: '16点之前' },
                { value: 0, name: '24点之前' },
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

export const TotalByTimeRangeOption = {
    title: {
        text: '按照时段统计总消费',
        subtext: '10点之前，16点之前，24点之前',
        x: 'center'
    },
    toolbox: {
        'show': true,
        'feature': {
            'saveAsImage': {},
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['10点之前', '16点之前', '24点之前']
    },
    series: [
        {
            name: '总消费',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                { value: 0, name: '10点之前' },
                { value: 0, name: '16点之前' },
                { value: 0, name: '24点之前' },
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

export const DiaryCompumptionOption = {
    title: {
        text: '每日消费',
    },
    toolbox: ToolboxForBar,
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b}\n{c}'
    },
    dataZoom: {
        show: true,
        realtime: true,
        start: 10,
        end: 90
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            label: {
                normal: {
                    show: true
                }
            },
            data: [],
            type: 'bar'
        }
    ]
};


export const MonthlyCompumptionBarOptionTotal = {

    title: {
        text: '每日消费',
    },
    toolbox: ToolboxForBar,
    grid: {
        left: 100
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b}:\n{c}元'
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 40
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            label: {
                normal: {
                    show: true
                }
            },
            data: [],
            type: 'bar',
            markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' }
                ]
              },
        
        }
    ]
};

export const MonthlyCompumptionBarOption = {
    title: {
        text: '每日消费',
    },
    toolbox: ToolboxForBar,
    legend: {
        data: ['住校', '非住校']
    },
    grid: {
        left: 100
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b}:\n{c}元'
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 40
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            label: {
                normal: {
                    show: true
                }
            },
            name: "住校",
            stack: '消费额',
            data: [],
            type: 'bar'
        },
        {
            label: {
                normal: {
                    show: true
                }
            },
            name: "非住校",
            stack: '消费额',
            data: [],
            type: 'bar'
        }
    ]
};


export const DairyCanlendarOption = {
    title: {
        text: '每日消费额',
        show: false
    },
    tooltip: {
        position: 'top',
        formatter: "{c}"
    },
    toolbox: {
        'show': true,
        'feature': {
            'saveAsImage': {},
        }
    },
    visualMap: [{
        min: 0,
        max: 60000,
        calculable: true,
        seriesIndex: [0, 1],
        orient: 'horizontal',
        left: 450,
        bottom: 20
    }],
    calendar: [
        {
            orient: 'vertical',
            yearLabel: {
                margin: 40
            },
            dayLabel: {
                firstDay: 1,
                nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            },
            monthLabel: {
                nameMap: 'cn',
                margin: 20
            },
            top: 100,
            left: 160,
            cellSize: 40,
            range: ['2018-08-01', '2018-10-31']
        },
        {
            orient: 'vertical',
            yearLabel: {
                margin: 40
            },
            dayLabel: {
                firstDay: 1,
                nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            },
            monthLabel: {
                nameMap: 'cn',
                margin: 20
            },
            top: 100,
            left: 660,
            cellSize: 40,
            range: ['2018-11-01', '2019-01-31']
        }
    ],
    series: [{
        type: 'effectScatter',
        symbolSize: null,
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: []
    },
    {
        type: 'effectScatter',
        symbolSize: null,
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: []
    }]
};
