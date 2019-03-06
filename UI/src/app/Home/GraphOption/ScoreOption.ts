/**
 *  个人成绩雷达图
 */
export const ScoreRadarGraphOption = {
    title: {
      text: '成绩'
    },
    tooltip: {},
    legend: {
      right: 10,
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
      indicator:[]
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

  export const CourseSelectCntOption = {
    title: {
      text: '高考七选三(单科)',
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
            show: true,
            formatter: '{b}\n{c}'
          }
        },
        data: [],
        type: 'bar'
      }
    ]
  };

  export const CourseSelectCombineCntOption = {
    title: {
      text: '高考七选三（组合）',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: '{b}\n{c}'
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