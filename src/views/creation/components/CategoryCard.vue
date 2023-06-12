<template>
  <div class="categoryCard">
    <Chart class="chart" :option="chartOption" :style="'height:258px;'"></Chart>
  </div>
</template>

<script setup>
import Chart from '@/components/Chart.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  name:{
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  extendsProps: {
    type: Object
  },
  styles:{
    type: String,
    default: ''
  }
})

const getSeries = ()=> {
  const series = props.data.seriesData.map((item, index) => {
    // console.log('series---1---', item)
    return {
      type: 'bar',
      barWidth: '10px',
      data: item.data,
      name: props.data.name[index]
    }
  })
  // console.log('series---2---', props.data, props.data.seriesData, props.data.name ,series)
  return series
}

const chartOption = ({
  title: {
    top: 20,
    show: true,
    left: '15px',
    textAlign: 'left',
    textStyle: {
        fontSize: '14',
        fontWeight: 600,
        fontFamily: 'PingFangSC-Medium',
    },
    text: props.title,
    z: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '1%',
    borderWidth: 0,
    containLabel: true
  },
  color: props.data.legendColor,
  xAxis: {
    type: 'category',
    // 隐藏 y 轴
    axisLine:{
      show: false
    },
    // 隐藏刻度线
    axisTick:{
      show: false
    },
    axisLabel:{
      textStyle:{
        color: 'rgba(0,0,0,0.65)',
        fontFamily: 'PingFangSC-Regular',
        fontWeight: 400,
        fontSize: '12',
      }
    },
    data: props.data.time
  },
  yAxis: {
    boundaryGap: true,
    axisLine:{
      show: false
    },
    axisTick:{
      show: false
    },
    axisLabel:{
      textStyle:{
          color: 'rgba(0,0,0,0.45)',
          fontFamily: 'PingFangSC-Regular',
          fontWeight: 400,
          fontSize: '12',
      }
    },
    type: 'value'
  },
  legend: {
    // y: 'center',
    icon: 'roundRect',
    // orient: 'vertical',
    // selectedMode: false,
    borderRadius: 8,
    itemHeight: 10,
    itemWidth: 16,
    right: 30,
    top: 6,
    data: props.data.name,
    // textStyle: {
    //     rich: {
    //         icons:{
    //             height: 14,
    //             width: 14,
    //         },
    //         names: {
    //             align: 'left',
    //             fontSize: 14,
    //             width: 80,
    //         },
    //         per: {
    //             align: 'left',
    //             fontSize: 14,
    //             width: 60,
    //         },
    //     }
    // }
  },
  series: getSeries()
  // [
  //   {
  //     name:'博客',
  //     type: 'bar',
  //     barWidth: '10px',
  //     data: [88, 110, 172, 143, 98, 106, 96]
  //   },
  //   {
  //     name:'回答',
  //     type: 'bar',
  //     barWidth: '10px',
  //     data: [880, 1100, 1720, 143, 98, 106, 96]
  //   },
  //   {
  //     name:'题库',
  //     type: 'bar',
  //     barWidth: '10px',
  //     data: [880, 1100, 1720, 143, 98, 106, 96]
  //   },
  //   {
  //     name:'考试',
  //     type: 'bar',
  //     barWidth: '10px',
  //     data: [880, 1100, 1720, 143, 98, 106, 96]
  //   }
  // ]
});

</script>

<style>
.categoryChart{

}

</style>
