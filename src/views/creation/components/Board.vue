<template>
  <div>
    <!-- 内容 -->
    <div class="main">
      <div class="title">我的热度</div>
      <div class="chart-container">
        <div class="line">
          <div class="chart-header">
            <div class="chart-title">浏览数趋势图</div>
            <!-- <el-select v-model="timeType" placeholder="请选择" size="small">
              <el-option v-for="item in timeOption " :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
          </div>
          <LineCard v-if="charts.browse_count" :data="charts.browse_count" :color="colors[0]"></LineCard>
        </div>
        <div class="line">
          <div class="chart-header">
            <div class="chart-title">点赞数趋势图</div>
            <!-- <el-select v-model="timeType" placeholder="请选择" size="small">
              <el-option v-for="item in timeOption " :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
          </div>
          <LineCard v-if="charts.like_count" :data="charts.like_count" :color="colors[1]"></LineCard>
        </div>
      </div>

      <div class="chart-container">
        <div class="line">
          <div class="chart-header">
            <div class="chart-title">评论数趋势图</div>
            <!-- <el-select v-model="timeType" placeholder="请选择" size="small">
              <el-option v-for="item in timeOption " :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
          </div>
          <LineCard v-if="charts.comment_count" :data="charts.comment_count" :color="colors[2]"></LineCard>
        </div>
        <div class="line">
          <div class="chart-header">
            <div class="chart-title">收藏数趋势图</div>
            <!-- <el-select v-model="timeType" placeholder="请选择" size="small">
              <el-option v-for="item in timeOption " :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
          </div>
          <LineCard v-if="charts.collection_count" :data="charts.collection_count" :color="colors[3]"></LineCard>
        </div>
      </div>

      <div class="statistics">
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.browse_count || 0}}
          </div>
          <div class="statistics-title">
            浏览数
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.like_count || 0}}
          </div>
          <div class="statistics-title">
            点赞数
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.comment_count || 0}}
          </div>
          <div class="statistics-title">
            评论数
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.star_count || 0 }}
          </div>
          <div class="statistics-title">
            收藏数
          </div>
        </div>
      </div>

      <div class="title">我的创作</div>

      <div class="chart-container ">
        <!-- 柱状图 -->
        <div class="category">
          <div class="chart-header">
            <div class="chart-title">创作数量趋势图</div>
            <!-- <el-select v-model="timeType" placeholder="请选择" size="small">
              <el-option v-for="item in timeOption " :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
          </div>
          <CategoryCard v-if="categoryData.seriesData[0].data.length" :data="categoryData"></CategoryCard>
        </div>
      </div>


      <div class="statistics">
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.blog_count || 0}}
          </div>
          <div class="statistics-title">
            博客
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.answer_count || 0}}
          </div>
          <div class="statistics-title">
            回答
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.quiz_count || 0}}
          </div>
          <div class="statistics-title">
            提问
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.question_bank_count || 0}}
          </div>
          <div class="statistics-title">
            题库
          </div>
        </div>
        <div class="statistics-field">
          <div class="statistics-total">
            {{ statistics?.question_count || 0}}
          </div>
          <div class="statistics-title">
            题目
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import LineCard from '@/views/creation/components/LineCard.vue'
import CategoryCard from '@/views/creation/components/CategoryCard.vue'
import { fetchFansChart } from "@/api/personalCenter.js";
import { fetchBoardCount, fetchBoardQue } from '@/api/creation.js'

let statistics = ref({});
let charts = ref({});

let colors = [
  ['#0175FF', '#83bbff','#f6faff'],
  ['#0FDED4', '#befcfa','#f5feff'],
  ['#32DF8E', '#9ff3ca','#f5feff'],
  ['#747DF4', '#afb5fa','#f5feff']]
let browseLine = ref({
})

let likeLine = ref({

})

const categoryTitle = ''
let categoryData = ref({
  time: [],
  seriesData: [{
    data: []
  }, {
    data: []
  }, {
    data: []
  }, {
    data: []
  }]
});

const timeType = ref('month')
const route = useRoute()
const totalNum = ref(0)
const LineChartData = ref([])
const timeOption = ref(
  [
    // {
    //   label: '近一天',
    //   value: 'day'
    // },
    // {
    //   label: '近一周',
    //   value: 'week'
    // },
    {
      label: '近一月',
      value: 'month'
    },
    // {
    //   label: '近一年',
    //   value: 'year'
    // }
  ]

)
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
})

// 点赞，收藏操作，需要更新右侧数据
// const handleAction = () => {
//   emit('updateSidebar')
// }

const getFansList = () => {
  fetchFansChart().then(res => {
    if (res.code === 0 && res.data) {
      res.data.forEach(item => {
        LineChartData.value.push([item.gmt_created, item.count])
      })
    }
  })
}

const getBoardCount = () => {
  fetchBoardCount().then(res => {
    if (res.code === 0 && res?.data) {
      statistics.value = { ...res?.data}
    }
  })
}

// const getChartData = (chartData) => {
//   return new Array(chartData.length).fill(1).map((item, index) => {
//     return [chartData[index].time, chartData[index].count]
//   })
// }
const translate = (respData) => {
  let chartData = {}
  Object.entries(respData).forEach(([key, arr]) =>{
    chartData[key] = (arr || []).map( (item, index) => {
      switch (key) {
        case 'blog_count':
          if(!categoryData.value.seriesData[0].data.length){
            categoryData.value.seriesData[0].data = new Array(arr.length).fill(0)
          }
          categoryData.value.seriesData[0].data[index] = item.num
          categoryData.value.time.push( item.time)
          break
        case 'answer_count':
          if(!categoryData.value.seriesData[1].data.length){
            categoryData.value.seriesData[1].data = new Array(arr.length).fill(0)
          }
          categoryData.value.seriesData[1].data[index] = item.num
          break
        case 'question_bank_count':
          if(!categoryData.value.seriesData[2].data.length){
            categoryData.value.seriesData[2].data = new Array(arr.length).fill(0)
          }
          categoryData.value.seriesData[2].data[index] = item.num
          break

        case 'exam_count':
          if(!categoryData.value.seriesData[3].data.length){
            categoryData.value.seriesData[3].data = new Array(arr.length).fill(0)
          }
          categoryData.value.seriesData[3].data[index] = item.num || 0
          break
      }
      return [item.time, item.num]
    })
    categoryData.value.name = ['博客', '回答', '题库', '考试']
    categoryData.value.legendColor = ['#55C6F5', '#55E9B1', '#F4B671', '#659AF5']
  })
  // console.log('------categoryData------', categoryData)
  charts.value = chartData
}

const getBoardQue = () => {
  fetchBoardQue().then(res => {
    if (res.code === 0 && res?.data) {
      translate(res.data)
    }
  })
  return ;
}

onMounted(() => {
  // getFansList()
  getBoardCount()
  getBoardQue()
})
</script>

<style lang="scss" scoped>
.tab {
  :deep(.active) {
    color: #333 !important;
    &::after {
      width: 0 !important;
      height: 0;
    }
  }
}
.main {
  width: 910px;
  margin: 0px auto;
  .title{
    color: #333333;
    line-height: 25px;
    font-weight: 600;
    font-size: 18px;
    height: 25px;
  }
  .chart-container {
    justify-content: space-between;
    margin-top: 12px;
    display: flex;
    border-radius: 4px;
    .card-show {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      .card-item {
        padding: 18px 18px 24px 20px;
        background-color: #fff;
        margin-bottom: 20px;
        height: 132px;
        width: 200px;
        .number {
          font-weight: 600;
          font-size: 28px;
          color: #333333;
          margin-bottom: 10px;
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: 32px;
            height: 32px;
          }
        }
        &:first-child {
          .line {
            width: 32px;
            height: 4px;
            background-image: linear-gradient(133deg, #6dc8ff 0%, #4399ff 100%);
          }
        }
        &:last-child {
          .line {
            width: 32px;
            height: 4px;
            background-image: linear-gradient(-42deg, #39decd 0%, #33e09f 100%);
          }
        }
      }
    }

    .chart-header {
      height: 25px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 21px 20px;
      .chart-title {
        font-weight: 600;
        font-size: 14px;
        color: #333333;
      }
      .el-select {
        width: 76px;
        border: none;
        :deep(.el-input__wrapper) {
          box-shadow: none !important   ;
          outline: none;
        }
      }
    }
  }
  .line{
    background: #FFFFFF;
    border-radius: 4px;
    height: 258px;
    width: 450px;
  }
  .category{
    background: #FFFFFF;
    border-radius: 4px;
    height: 328px;
    width: 910px;
  }
  .statistics{
    display: flex;
    background: #FFFFFF;
    border-radius: 4px;
    margin: 12px 0 30px 0;
    height: 120px;
    width: 910px;
    .statistics-field{
      flex: 1;
      .statistics-total{
        color: #333333;
        text-align: center;
        line-height: 40px;
        font-weight: 600;
        margin-top: 25px;
        font-size: 28px;
      }
      .statistics-title{
        color: #6D717D;
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
