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