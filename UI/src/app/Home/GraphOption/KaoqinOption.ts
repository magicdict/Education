/**旭日图 */
export interface ISunburstOption {
    toolbox?: any,
    title: {
        text: string,
        left: number
    },
    tooltip: {

    }
    label: {
        formatter?: string
    }
    series: {
        type: 'sunburst';
        data: ILeaf[],
        center?: number[] | string[]
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
        formatter?: any;
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

export const ToolboxForBar = {
    'show': true,
    'feature': {
        'saveAsImage': {},
        'magicType': {
            'type': ['line', 'bar']
        }
    }
}

export const ToolboxSaveImageOnly = {
    'show': true,
    'feature': {
        'saveAsImage': {}
    }
}

export interface ISimpleBar {
    toolbox?: any,
    tooltip?: {},
    title?: {
        text: string,
        left?: number
    },
    xAxis: {
        type: string,
        data: string[],
        axisLabel?: any
    },
    yAxis: {
        type: string
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
