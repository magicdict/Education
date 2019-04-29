import { ToolboxSaveImageOnly, ToolboxForBar } from './KaoqinOption';

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
      label: {
        normal: {
          show: true,
          formatter: '{b}\n{c}'
        }
      },
      data: [],
      type: 'bar'
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
    height: '50%',
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
    bottom: '15%'
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
    bottom: 100
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 90
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
    show: false
  },
  toolbox: ToolboxSaveImageOnly,
  tooltip: {
    trigger: 'item',
    formatter: "{b} : {c}"
  },
  legend: {
    data: []
  },
  calculable: true,
  series: [
    {
      name: '漏斗图',
      type: 'funnel',
      left: '10%',
      top: 60,
      //x2: 80,
      bottom: 60,
      width: '80%',
      // height: {totalHeight} - y - y2,
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