/**旭日图 */
export interface ISunburstOption {
    title: {
        text: string,
        left: number
    },
    label: {
        formatter?: string
    }
    series: {
        type: 'sunburst';
        data: ILeaf[],
        center?: number[]|string[]
    }
};

export interface ILeaf {
    name: string,
    value: number,
    itemStyle?: {
        color: string
    },
    children?: ILeaf[]
}

/**堆叠柱状图 */
export interface IStackBarOption {
    title: {
        text: string,
        left?: number
    },
    legend: {
        data: string[]
    },
    label: {
        formatter?: string
    },
    xAxis: {
        type: string,
        data: string[]
    },
    yAxis: {
        type: string
    },
    dataZoom: {
        show: boolean,
        realtime: boolean,
        start: number,
        end: number
    },
    series: IStack[]

}

export interface IStack {
    label: {
        normal: {
            show: boolean
        }
    },
    name: string,
    stack: string,
    data: { name: string, value: number }[],
    type: string
}


export interface ISimpleBar {
    xAxis: {
        type: 'category',
        data: string[]
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        label?: {
            normal: {
                show: boolean
            }
        },
        data: number[],
        type: 'bar'
    }]
}
