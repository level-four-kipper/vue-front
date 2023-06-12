function getOptions(timeArr, valueArr, lineColor, areaColor) {
  if (timeArr.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#9196a6',
          fontWeight: 'normal',
          fontSize: 15
        }
      }
    }
  }
  return {
    grid: {
      left: '0',
      right: '0',
      bottom: '0',
      height: '95%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: '14px',
        color: '#9196A6',
        showMinLabel: false,
        showMaxLabel: true,
        align: 'right'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E3E3ED'
        }
      },
      data: timeArr
    },
    yAxis: {
      type: 'value',
      interval: 1, // 步长
      min: 0,
      splitLine: {
        show: false,
        lineStyle: {
          color: '#eee'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: '14px',
        color: '#9196A6',
        formatter: '{value}'
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        data: valueArr,
        type: 'line',
        symbol: 'none',
        smooth: true,
        lineStyle: {
          width: 3, //波形图波浪的边框
          borderWidth: 0,
          color: lineColor
        },
        areaStyle: {
          //渐变色
          color: areaColor
        }
      }
    ]
  }
}

export default getOptions
