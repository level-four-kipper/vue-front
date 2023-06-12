<template>
  <div class="exerciseFinished" ref="exerciseFinished">
    <div class="content">
      <div class="finished">
        <img src="@/assets/img/questionBank/finished.png" alt="已完成" />
        <div class="congratulation">恭喜您已完成全部题目</div>
      </div>
      <div class="divider"></div>
      <div class="detail">
        <div class="detailItem">
          刷题数量
          <span>{{result.count}}</span>
        </div>
        <div class="detailItem">
          正确率
          <span>{{result.accuracy}}</span>
        </div>
        <div class="detailItem">
          总用时
          <span>{{result.timing}}min</span>
        </div>
        <div class="detailItem">
          当前排名
          <span>{{result.ranking}}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <template v-if="result.accuracy !== '100.0%'">
        错误题目已加入到您的收藏夹
        <el-button type="text" @click="checkWrong" class="checkButton">查看错题 ></el-button>
      </template>

      <el-button type="primary" @click="tryAgain">再来一次</el-button>
    </div>
  </div>
</template>

<script setup name="ExerciseFinished">
import { onMounted } from 'vue'
import { getExerciseStart } from '@/api/questionBank.js'

const router = useRouter()
const route = useRoute()

const result = ref({})

// 开始刷题
function fetchExerciseStart() {
  getExerciseStart(String(route.query.id))
    .then(({ code }) => {
      if (code === 0) {
        router.push({ path: '/exerciseModel/exercising', query: { id: route.query.id } })
      }
    })
    .catch(err => console.log(err))
}

// 直接开始
const checkWrong = () => {
  router.push('/personalIndex/myCollect?tabIndex=4')
}
// 继续上一次
const tryAgain = () => {
  // router.push({ path:'/exerciseModel/start', query: { id: route.query.id }})
  // router.push({ path:'/exerciseModel/exercising', query: { id: route.query.id }})
  fetchExerciseStart()
}

onMounted(async () => {
  let bank_result = sessionStorage.getItem('bank_result')
  if (bank_result) {
    result.value = JSON.parse(bank_result)
  }
})
</script>
<style lang="scss" scoped>
.exerciseFinished {
  color: #535560;
  background-color: #ffffff;
  height: 600px;
  margin: 20px;
  width: 1200px;
  padding-top: 136px;
  text-align: center;
  .content {
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 28px;
    padding: 0 20.75%;
    display: flex;
    .finished {
      width: 255px;
      img {
        height: 158px;
        width: 250px;
      }
      .congratulation {
        font-size: 16px;
        color: #535560;
        font-weight: 500;
      }
    }
    .divider {
      opacity: 0.5;
      background: #c8c8db;
      border-left: 1px solid #c8c8db;
      margin: 0 12.5%;
      height: 190px;
    }
    .detail {
      .detailItem {
        display: flex;
        color: #535560;
        justify-content: space-between;
        font-size: 14px;
        height: 25px;
        width: 230px;
        margin: 16px 0px 6px 0px;
        line-height: 25px;
        span {
          color: #333333;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }
  .footer {
    bottom: 30px;
    border-radius: 4px;
    background: #eef3fd;
    font-size: 16px;
    height: 110px;
    left: 2.5%;
    line-height: 110px;
    position: absolute;
    text-align: center;
    width: 95%;
    .checkButton {
      margin: 0px 5px;
    }
  }
  :deep(.el-button--primary) {
    cursor: pointer;
    background: #0175ff;
    border-color: #0175ff;
    border-radius: 4px;
  }
}
</style>
