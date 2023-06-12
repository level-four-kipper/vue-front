<template>
  <div class="header">
    <div class="header-title">{{ questionBank.name}}</div>
    <div class="header-content">
      {{ questionBank.description }}
    </div>
    <div class="header-detail">
      <el-button @click="toggleCollect(questionBank)" plain :class="['left-button',questionBank.is_collect ? 'header-active':'']">
        <img v-show="!questionBank.is_collect" class="avatar" src="@/assets/img/collect_in.png " alt="收藏题库" />
        <img v-show="questionBank.is_collect" class="avatar" src="@/assets/img/collected.png " alt="已收藏" />
        收藏题库
      </el-button>
      <span>创建人：{{questionBank.creator }}</span>
      <span>创建于{{questionBank.gmt_created }}</span>
      <span>{{questionBank.total_questions || 0 }}收录题目</span>
      <span>{{questionBank.browse_count || 0 }}参与人数</span>
      <span>{{questionBank.collect_count || 0 }}收藏</span>

      <el-button type="primary" @click="jumpExercise(questionBank)" plain class="right-button">
        刷题模式 >
      </el-button>
    </div>
  </div>
</template>

<script setup name="Header">
import { onMounted,ref } from "vue";
import { ElMessage } from 'element-plus'
import { fetchQuestionBanks } from '@/api/questionBank.js'
import { updateCollect } from '@/api/answer.js'

const props = defineProps({
  exerciseEnable: {
    type: Boolean,
    default: false
  }
})
const questionBank = ref({})

// 题库的详情
function getQuestionBankDetail() {
  fetchQuestionBanks(String(route.query.id)).then(res => {
    if (res.code === 0 && res?.data) {
      questionBank.value = { ...res.data}
    }
  }).catch(err => console.log(err))
}

// 跳转我来回答
const router=useRouter()
const route = useRoute()

const jumpExercise = function (question) {
  if(props.exerciseEnable){
    router.push({ path:'/exerciseModel/start', query: { id: route.query.id, total: question.total_questions }})
  } else {
    ElMessage({ showClose: true, message: '暂无试题可以刷', type: 'warning' })
  }
}

const emit = defineEmits(['collect'])

const toggleCollect = (questionBank) => {
  const params = {
    article_id: questionBank.id,
    article_type: 5
  }
  updateCollect(params)
    .then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: '收藏失败', type: 'error' })
      } else {
        getQuestionBankDetail()
        emit('collect')
      }
    })
    .catch(err => {
      console.log(err)
      ElMessage({ showClose: true, message: '收藏失败', type: 'error' })
    })
}

onMounted(() => {
  getQuestionBankDetail()
})
</script>

<style lang="scss" scoped>
.header {
  margin-top: 35px;
  .header-active {
    color: #0175ff;
  }
  .header-title {
    color: #333333;
    font-weight: 800;
    font-size: 26px;
    height: 38px;
  }
  .header-content{
    color: #333333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    margin: 20px 0;
    height: 20px;
  }
  .header-detail{
    color: #9196A6;
    font-size: 14px;
    display: flex;
    vertical-align: middle;
    align-items: center;
    .left-button{
      margin-right: 30px;
      border-radius: 4px;
      height: 42px;
      width: 120px;
      color: #0175FF;
    }
    span {
      padding-right: 20px;
    }
    .right-button{
      color: #FFFFFF;
      margin-left: auto;
      background: #0175FF;
      border-radius: 4px;
      font-size: 16px;
      height: 42px;
      width: 120px;
    }
  }
  button {
    border: 1px solid #0175ff;
    border-radius: 4px;
    line-height: 32px;
    padding: 0 12px;
    vertical-align: middle;
    img, i {
      vertical-align: middle;
      padding-right: 10px;
    }
  }
}
</style>
