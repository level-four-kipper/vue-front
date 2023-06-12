<template>
  <div>
    <!-- tab -->
    <TabSubTab :list="[{ label: '我的粉丝', value: 0 }]" />
    <!-- 内容 -->
    <div class="main">
      <div class="chart-container">

        <div class="card-show">
          <div class="card-item">
            <div class="card-header">
              <span>当前总数</span>
              <img src="@/assets/img/personalCenter/people-blue.png" alt="">
            </div>
            <div class="number">1824</div>
            <div class="line"></div>
          </div>
          <div class="card-item">
            <div class="card-header">
              <span>今日新增</span>
              <img src="@/assets/img/personalCenter/people-green.png" alt="">
            </div>
            <div class="number">3</div>
            <div class="line"></div>
          </div>
        </div>
        <!-- 图表展示 -->
        <div class="chart-show">
          <div class="chart-header">
            <div class="title">粉丝数量变化</div>
            <el-select v-model="timeType" placeholder="请选择" size="small">
              <el-option v-for="item in timeOption " :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <Chart></Chart>
        </div>
      </div>
      <FansList tabLabel="粉丝"></FansList>
    </div>
  </div>
</template>

<script setup>
import TabSubTab from '../components/TabSubTab.vue'
import FansList from '../components/FansList.vue'
import Chart from '@/components/Chart.vue'


const timeType = ref('mouth')
const route = useRoute()
const totalNum = ref(0)
const timeOption = ref(
  [
    {
      label: '近一天',
      value: 'day'
    },
    {
      label: '近一周',
      value: 'week'
    },
    {
      label: '近一月',
      value: 'mouth'
    },
    {
      label: '近一年',
      value: 'year'
    }
  ]

)
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
})


// 点赞，收藏操作，需要更新右侧数据
const handleAction = () => {
  emit('updateSidebar')
}
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
  margin: 20px auto;
  .chart-container {
    display: flex;
    .card-show {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      .card-item {
        margin-bottom: 20px;
        padding: 18px 18px 24px 20px;
        background-color: #fff;
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

    .chart-show {
      background-color: #fff;
      height: 284px;
      flex: 1;
      .chart-header {
        height: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        margin-top: 10px;
        .title {
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
      .chart {
        flex: 1;
      }
    }
  }
}
</style>