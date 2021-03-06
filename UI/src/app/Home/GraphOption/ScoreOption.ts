import { ToolboxSaveImageOnly, ToolboxForBar } from './KaoqinOption';


export const ExamSubNameOption = {
  title: {
    text: '语文期中考试'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['最高分', '最低分', '平均分']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {},
      magicType: { type: ['line', 'bar'] }
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    axisLabel: {
      interval: 0
    },
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '最高分',
      type: 'line',
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
      data: []
    },
    {
      name: '最低分',
      type: 'line',
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
      data: []
    },
    {
      name: '平均分',
      type: 'line',
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
      data: []
    }
  ]
};

/**
 *  个人成绩雷达图
 */
export const ScoreRadarGraphOption = {
  title: {
    text: '成绩'
  },
  tooltip: {},
  toolbox: {
    'show': true,
    'feature': {
      'saveAsImage': {}
    },
  },
  legend: {
    data: ['等第', 'TScore']
  },
  radar: {
    name: {
      textStyle: {
        color: '#fff',
        backgroundColor: '#999',
        borderRadius: 3,
        padding: [3, 5]
      }
    },
    radius: "65%",
    indicator: []
  },
  series: [{
    name: '各科平均分',
    type: 'radar',
    data: [
      {
        value: [],
        name: '等第'
      },
      {
        value: [],
        name: 'TScore'
      }
    ]
  }]
};

export const ScoreRadarGraphForClassOption = {
  title: {
    text: '成绩'
  },
  tooltip: {},
  toolbox: {
    'show': true,
    'feature': {
      'saveAsImage': {}
    },
  },
  legend: {
    data: ['最高分', '最低分', '平均分']
  },
  radar: {
    name: {
      textStyle: {
        color: '#fff',
        backgroundColor: '#999',
        borderRadius: 3,
        padding: [3, 5]
      }
    },
    radius: "65%",
    indicator: []
  },
  series: [{
    name: '各科平均分',
    type: 'radar',
    data: [
      {
        value: [],
        name: '最高分'
      },
      {
        value: [],
        name: '最低分'
      },
      {
        value: [],
        name: '平均分'
      }
    ]
  }]
};

export const CourseSelectRadarGraphOption = {
  title: {
    text: '高考七选三(单科)'
  },
  toolbox: ToolboxSaveImageOnly,
  tooltip: {},
  legend: {
    right: 40,
    data: ['人数']
  },
  radar: {
    name: {
      textStyle: {
        color: '#fff',
        backgroundColor: '#999',
        borderRadius: 3,
        padding: [3, 5]
      }
    },
    indicator: []
  },
  series: [{
    name: '各科选择人数',
    type: 'radar',
    data: [
      {
        value: [],
        name: '人数'
      }
    ]
  }]
};

export const CourseSelectCntOption = {
  title: {
    text: '高考七选三(单科)',
  },
  tooltip: {},
  toolbox: ToolboxForBar,
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      stack: '',
      name: '',
      label: {
        normal: {
          show: true,
          formatter: '{b}\n{c}'
        }
      },
      data: [],
      type: 'bar',
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      },
    }
  ]
};

export const CourseSelectTwoCntOption = {
  title: {
    text: '高考七选三(两门)',
  },
  toolbox: ToolboxSaveImageOnly,
  tooltip: {
    position: 'top',
  },
  animation: false,
  grid: {
    height: '70%',
    y: '10%'
  },
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 200,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '5%'
  },
  series: [{
    name: '两门课程组合',
    type: 'heatmap',
    data: [],
    label: {
      normal: {
        show: true
      }
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
};


export const CourseSelectThreeCntOption = {
  title: {
    text: '高考七选三（组合）',
  },
  toolbox: ToolboxForBar,
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: '{b}\n{c}'
  },
  grid: {
    left: 30, right: 0,
    bottom: 100
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0
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
      type: 'bar'
    }
  ]
};

export const SelectCourseSankeyOption = {
  toolbox: ToolboxSaveImageOnly,
  title: {
    text: '桑基图'
  },
  series: {
    type: 'sankey',
    layout: 'none',
    focusNodeAdjacency: 'allEdges',
    data: [],
    links: []
  }
}


export const ScoreFunnelOption =
{
  title: {
    text: '分数段人数',
    show: true,
  },
  toolbox: {
    'show': true,
    'feature': {
      'saveAsImage': {}
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: "{b} : {c}"
  },
  legend: {
    top: 25,
    data: []
  },
  calculable: true,
  series: [
    {
      name: '漏斗图',
      type: 'funnel',
      left: '10%',
      width: '80%',
      bottom: 0,
      top: 100,
      min: 0,
      max: 50,
      minSize: '0%',
      maxSize: '100%',
      sort: 'none',
      gap: 2,
      label: {
        show: true,
        position: 'inside'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: [

      ]
    }
  ]
};