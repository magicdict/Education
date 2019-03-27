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
        data: ILeaf[]
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