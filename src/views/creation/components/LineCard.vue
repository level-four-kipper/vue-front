<template>
  <div class="lineChart">
    <Chart v-if="data?.length" class="chart" :option="chartOption" :style="'height:216px;'"></Chart>
  </div>
</template>

<script setup>
import Chart from '@/components/Chart.vue'
import { color } from 'echarts/core';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  } ,
  extendsProps: {
    type: Object,
    default: () => {}
  },
  styles:{
    type: String,
    default: ''
  },
  color:{
    type: Array,
    default: () => []
  }
})

const chartOption = ({
  backgroundColor: '#ffffff',
  grid: {
    left: '56',
    bottom: '42',
    right: '16',
    top: '10'
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  xAxis: {
    type: 'category',
    splitLine: false,
    axisTick: false,//坐标轴刻度
    // 轴线
    axisLine: {
      // onZero: true,
      boundaryGap: false,
      lineStyle: {
        color: '#E3E3ED',
      }
    },
    //刻度标签
    axisLabel: {
      color: "#9196A6",
    }
  },
  yAxis: {
    type: 'value',
    splitLine: false,
    minInterval: 1,
  },
  series: [
    {

      data: props.data,
      type: 'line',
      showSymbol: false,
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
            color: props.color[1]//'rgba(1,117,255,0.20)'  //  0% 处的颜色
          }, {
            offset: 1,
            color: props.color[2]//'rgba(1,117,255,0.00)' //   100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      color: props.color[0], //线条颜色
    }
  ]
});

</script>

<style>
.lineChart{
  height:216px;
}

</style>
