<template>
  <Chart :option="chartOption"></Chart>
</template>

<script setup> 
import Chart from '@/components/Chart.vue'

const props = defineProps({
  data: Array,
})

const chartOption = ({
  backgroundColor: '#fff',
  // title: {
  //   text: "粉丝数量变化",
  //   left: "20",
  //   top: "16",
  //   textStyle: {
  //     fontSize: 14
  //   }
  // },
  grid: {
    left: '40',
    bottom: '42',
    right: '40',
    top: '10'
  },
  tooltip: {
    trigger: "axis",
    className: 'echarts-tooltip',
    formatter: (params => {
      return `<div>${params[0].value[1]}</div> <div>${params[0].value[0]}</div>`
    })
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    splitLine: false,
    axisTick: false,//坐标轴刻度
    // 轴线
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#E3E3ED',
      }
    },
    //刻度标签
    axisLabel: {
      color: "#9196A6",
      //  padding: [0, 0, 0, 30]        
    }

  },
  yAxis: {
    type: 'value',
    splitLine: false,
    minInterval: 1,
    splitNumber: 5,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E3E3ED',
      }
    },
    //刻度标签
    axisLabel: {
      color: "#9196A6",
    }

  },
  series: [
    {
      data: props.data,
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(1,117,255,0.20)'  //  0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(1,117,255,0.00)' //   100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      color: '#0175FF', //线条颜色


      // emphasis: {
      //   itemStyle: {
      //     shadowBlur: 10,
      //     shadowOffsetX: 0,
      //     shadowColor: "rgba(0, 0, 0, 0.5)"
      //   }
      // }
    }
  ]
});




</script>

<style lang="scss" scoped>
.chart {
  height: 244px;
  :deep(.echarts-tooltip) {
    div {
      &:first-child {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }
      &:last-child {
        font-size: 12px;
        color: #9196a6;
        font-weight: 400;
      }
    }
  }
}
</style>