<template>
  <div class="main__left">
    <div class="main__left__top">
      <!-- 当前总数 -->
      <div class="panel">
        <div class="box panel__total">
          <TotalPanel :number="all_count" />
        </div>
        <div class="box panel__month">
          <MonthPanel
            :month-number="increment_for_last_month"
            :month-trend="trend_for_last_month"
            :day-number="increment_for_yesterday"
            :day-trend="trend_for_yesterday"
          />
        </div>
      </div>
      <!-- 题目数量变化趋势 -->
      <div class="box quantity-trend">
        <div class="chart-header">
          <div class="title">题目数量变化趋势</div>
          <el-dropdown @command="handleQuestionCommand">
            <span class="el-dropdown-link">
              {{ dateOptions[questionDateIndex].label }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item,index) in dateOptions"
                  :key="item.value"
                  :command="index"
                >{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="chart-content" style="height: 181px;">
          <Chart :option="questionOptions" style="width: 100%; height: 100%;" />
        </div>
      </div>
    </div>
    <!-- 题库互动变化趋势 -->
    <div class="main__left__bottom box">
      <div class="chart-header">
        <div class="title">题库互动变化趋势</div>
        <div class="type-list">
          <span
            v-for="(item,index) in typeOptions"
            :key="item.value"
            :class="{'active': typeIndex === index}"
            @click="handleTypeClick(index)"
          >{{ item.label }}</span>
        </div>
        <el-dropdown @command="handleQuestionBankCommand">
          <span class="el-dropdown-link">
            {{ dateOptions[questionBankDateIndex].label }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item,index) in dateOptions"
                :key="item.value"
                :command="index"
              >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="chart-content" style="height: 318px;">
        <Chart :option="questionBankOptions" style="width: 100%; height: 100%;" />
      </div>
    </div>
  </div>
  <div class="main__right">
    <!-- 达人榜单 -->
    <div class="box top-user">
      <TopUser />
    </div>
    <!-- 相关问题 -->
    <div class="box top-question">
      <TopQuestion />
    </div>
  </div>
</template>

<script setup>
import TotalPanel from './components/TotalPanel.vue'
import MonthPanel from './components/MonthPanel.vue'
import TopUser from './components/TopUser.vue'
import TopQuestion from './components/TopQuestion.vue'
import Chart from '@/components/Chart.vue'
import * as echarts from 'echarts'

import useQuestionbank from '@/hooks/useQuestionbank'
import getOptions from '@/utils/questionbankChart.js'
import { fetchBoardCount, fetchBoardCountTrend, fetchBoardInteractTrend } from '@/api/questionBank.js'

const { bankId } = useQuestionbank()

const dateOptions = [
  { label: '按日', value: 0 },
  { label: '按月', value: 1 },
  { label: '按年', value: 2 }
]
const typeOptions = [
  // { label: '点赞', value: 'like_count' },
  { label: '收藏', value: 'fav_count' },
  { label: '评论', value: 'comment_count' },
  { label: '刷题', value: 'exercised_count' },
  { label: '浏览', value: 'read_count' }
]
const typeIndex = ref(0)
const questionDateIndex = ref(1)
const questionBankDateIndex = ref(1)
const questionOptions = ref(null)
const questionBankOptions = ref(null)

const all_count = ref(0)
const increment_for_last_month = ref(0)
const increment_for_yesterday = ref(0)
const trend_for_last_month = ref(0)
const trend_for_yesterday = ref(0)
const interactTrendData = ref(null)

// 互动类型切换
const handleTypeClick = index => {
  typeIndex.value = index
  getInteractTrend()
}

const handleQuestionCommand = index => {
  questionDateIndex.value = index
  _fetchBoardCountTrend()
}

const handleQuestionBankCommand = index => {
  questionBankDateIndex.value = index
  _fetchBoardInteractTrend()
}

// 题目数量变化趋势
const updateQuestionChart = (timeArr, valueArr) => {
  const options = getOptions(
    timeArr,
    valueArr,
    '#32DF8E',
    new echarts.graphic.LinearGradient(
      0,
      0,
      0,
      1,
      [
        {
          //波形图渐变色样式
          offset: 0,
          color: '#cdfde3'
        },
        {
          offset: 1,
          color: '#f8fffc'
        }
      ],
      false
    )
  )

  questionOptions.value = options
}

// 题库互动变化趋势
const updateQuestionBackChart = (timeArr, valueArr) => {
  const options = getOptions(
    timeArr,
    valueArr,
    '#0175FF',
    new echarts.graphic.LinearGradient(
      0,
      0,
      0,
      1,
      [
        {
          //波形图渐变色样式
          offset: 0,
          color: '#d4e8ff'
        },
        {
          offset: 1,
          color: '#fdfeff'
        }
      ],
      false
    )
  )

  questionBankOptions.value = options
}

// 总题数，昨日、上月新增题数
const _fetchBoardCount = () => {
  fetchBoardCount(bankId.value).then(res => {
    if (res.code === 0 && res.data) {
      ;({
        all_count: all_count.value,
        increment_for_last_month: increment_for_last_month.value,
        increment_for_yesterday: increment_for_yesterday.value,
        trend_for_last_month: trend_for_last_month.value,
        trend_for_yesterday: trend_for_yesterday.value
      } = res.data)
    }
  })
}

// 题数趋势
const _fetchBoardCountTrend = () => {
  fetchBoardCountTrend(bankId.value, dateOptions[questionDateIndex.value].value).then(res => {
    const timeArr = []
    const valueArr = []
    for (let i in res.data) {
      timeArr.push(i)
      valueArr.push(res.data[i])
    }
    updateQuestionChart(timeArr, valueArr)
  })
}

// 互动趋势
const _fetchBoardInteractTrend = () => {
  fetchBoardInteractTrend(bankId.value, dateOptions[questionBankDateIndex.value].value).then(res => {
    interactTrendData.value = res.data || null
    getInteractTrend()
  })
}

// 互动数据
const getInteractTrend = () => {
  const timeArr = []
  const valueArr = []
  const type = typeOptions[typeIndex.value].value
  console.log(type)
  for (let i in interactTrendData.value) {
    timeArr.push(i)
    valueArr.push(interactTrendData.value[i][type] || 0)
  }

  updateQuestionBackChart(timeArr, valueArr)
}

onMounted(() => {
  _fetchBoardCount()
  _fetchBoardCountTrend()
  _fetchBoardInteractTrend()
})
</script>

<style lang="scss" scoped>
.main__left {
  width: calc(100% - 320px);
  margin-right: 20px;
  &__top {
    display: flex;
    .panel {
      width: 346px;
      margin-right: 20px;
      &__total {
        height: 160px;
        background-image: linear-gradient(208deg, #6dc8ff 0%, #4399ff 100%);
      }
      &__month {
        height: 88px;
        margin-top: 10px;
      }
    }
    .quantity-trend {
      flex: 1;
      // width: calc(100% - 366px);
      height: 258px;
      .chart-header {
        display: flex;
        justify-content: space-between;
        top: -4px;
        margin-bottom: 4px;
      }
    }
  }
  &__bottom {
    height: 454px;
    .chart-header {
      text-align: center;
    }
  }
}
.main__right {
  width: 300px;
  .top-user {
    height: 506px;
  }
  .top-question {
    height: 206px;
  }
}

.box {
  margin-top: 20px;
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}
.chart-header {
  position: relative;
  margin-bottom: 24px;
  .el-dropdown {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 20px;
    color: #9196a6;
    cursor: pointer;
  }
  .title {
    line-height: 20px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  .type-list {
    display: flex;
    justify-content: center;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 36px;
      margin-right: 20px;
      border: 1px solid #d3d3de;
      border-radius: 4px;
      font-size: 14px;
      color: #6a6f7b;
      cursor: pointer;
      &.active,
      &:hover {
        background: #eef3fd;
        border-color: #0175ff;
        color: #0175ff;
        font-weight: 600;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
