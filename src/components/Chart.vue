<template>
  <!-- vue-echarts 更多配置查看官网 -->
  <!-- https://github.com/ecomfe/vue-echarts/blob/main/README.zh-Hans.md -->
  <v-chart ref="echart" :class="$attrs.class" :option="option" :style="style" />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, SingleAxisComponent, GridComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide } from 'vue'

use([CanvasRenderer, PieChart, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, SingleAxisComponent, GridComponent])

const props = defineProps({
  option: { type: Object },
  style: { type: String, default: () => 'height: 244px;' }
})

const echart = ref(null)

/*
  自适应
*/
const resizeChart = () => {
  echart.value?.resize()
}
onMounted(() => {
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
</style>
