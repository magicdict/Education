export const regionMapOptions = {
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

export const SchoolSexBarOption = {
  color: ['lightblue', 'pink'],
  title: {
    text: '性别比例',
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

export const SexRatePieOption = {
  title: {
    text: '性别比例',
    x: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: "{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['男', '女']
  },
  series: [
    {
      name: '性别比例',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      label: {
        normal: {
          position: 'inner'
        }
      },
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


export const SexRateSunburstOption = {
  title: {
    text: '性别比例',
    left: 10
  },
  label: {
    formatter: "{b}\n{c}"
  },
  series: {
    type: 'sunburst',
    data: [
      {
        name: '全校',
        value: 26,
        itemStyle: { color: "#d48265" },
        children: [
          {
            name: '高一',
            value: 8,
            itemStyle: {
              color: '#91c7ae'
            },
            children: [
              {
                name: '男生',
                value: 3,
                itemStyle: {
                  color: 'lightblue'
                }
              },
              {
                name: '女生', value: 5,
                itemStyle: {
                  color: 'pink'
                }
              }
            ]
          },
          {
            name: '高二',
            value: 8,
            itemStyle: {
              color: '#bda29a'
            },
            children: [
              {
                name: '男生', value: 3,
                itemStyle: {
                  color: 'lightblue'
                }
              },
              {
                name: '女生', value: 5,
                itemStyle: {
                  color: 'pink'
                }
              }
            ]
          },
          {
            name: '高三',
            value: 10,
            itemStyle: {
              color: '#61a0a8'
            },
            children: [
              {
                name: '男生', value: 4,
                itemStyle: {
                  color: 'lightblue'
                }
              },
              {
                name: '女生', value: 6,
                itemStyle: {
                  color: 'pink'
                }
              }
            ]
          }
        ]
      }],
    radius: [0, '90%'],
    label: {
      rotate: 'radial'
    }
  }
};


export const CompumptionBarGraph = {
  title: {
    text: "消费记录（月度）"
  },
  tooltip: {},
  legend: {
    data: ['消费额']
  },
  xAxis: {
    data: []
  },
  yAxis: {},
  series: [{
    name: '消费额',
    type: 'bar',
    data: []
  }]
};

export const KaoqinBarGraph = {
  title: {
    text: '考勤（月度）'
  },
  tooltip: {},
  legend: {
    data: ['次数']
  },
  xAxis: {
    data: []
  },
  yAxis: {},
  series: [{
    name: '次数',
    type: 'bar',
    data: []
  }]
};