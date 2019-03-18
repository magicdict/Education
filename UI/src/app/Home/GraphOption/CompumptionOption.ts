export const DiaryAvgByTimeRangeOpt = {
    title: {
        text: '按照时段统计每日平均消费',
        subtext: '10点之前，16点之前，24点之前',
        x: 'center'
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

export const TotalByTimeRangeOpt = {
    title: {
        text: '按照时段统计总消费',
        subtext: '10点之前，16点之前，24点之前',
        x: 'center'
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

export const DiaryCompumptionOpt = {
    title: {
        text: '每日消费',
    },
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

export const MonthlyCompumptionOpt = {
    title: {
        text: '每日消费',
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