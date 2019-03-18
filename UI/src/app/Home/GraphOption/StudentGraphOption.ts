export const regionOptions = {
  title: {
    text: '生源地图',
    left: 10
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}：{c}'
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  visualMap: {
    min: 0,
    max: 50,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#ADCDEF', '#2171C1']
    }
  },
  series: [
    {
      type: 'map',
      mapType: 'China',
      itemStyle: {
        normal: {
          areaColor: '#AAD5FF',
          borderColor: 'white',
          label: { show: true, color: 'white' }
        },
        emphasis: {
          areaColor: '#A5DABB'
        }
      },
      zoom: 1.2,
      data: []
    }]
}

export const SchoolSexOption = {
  color: ['lightblue', 'pink'],
  title: {
    text: '男女比例',
    left: 10
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['男', '女']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'value'
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['整体', '高一', '高二', '高三']
    }
  ],
  series: [
    {
      name: '男',
      type: 'bar',
      stack: '性别比例',
      label: {
        normal: {
          show: true
        }
      },
      data: []
    },
    {
      name: '女',
      type: 'bar',
      stack: '性别比例',
      label: {
        normal: {
          show: true
        }
      },
      data: []
    }
  ]
};

export const SexRateOption = {
  title: {
    text: '男女比例',
    x: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['男', '女']
  },
  series: [
    {
      name: '男女比例',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      color: ['lightblue', 'pink'],
      data: [
        { value: 0, name: '男' },
        { value: 0, name: '女' },
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

