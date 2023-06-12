<!-- 题库信息 -->
<template>
  <div class="question-bank-detail">
    <div class="question-bank-detail__header">题库信息</div>
    <div class="question-bank-detail__main item">
      <p class="item__title">题库名称</p>
      <p class="item__content">{{ model.name || '--' }}</p>
      <p class="item__title">题库分类</p>
      <p class="item__content">{{ model.area_type || '--' }}</p>
      <p class="item__title">题库介绍</p>
      <p class="item__content">{{ model.description || '--' }}</p>
    </div>
    <el-button plain class="question-bank-detail__footer submit-btn" @click="handleSubmit">
      <img src="@/assets/img/创建-1.png" alt="" />
      <span>提交全部题目</span>
    </el-button>
  </div>
</template>

<script setup name="questionBankDetail">
import useQuestionbank from '@/hooks/useQuestionbank'
import Bus from '@/utils/bus.js'

const route = useRoute()
const { _fetchGetQuestionbank } = useQuestionbank()
const model = ref({
  name: '',
  area_type: '',
  description: '',
})
// 获取详情
const getDetail = () => {
  const { id = '' } = route.query
  _fetchGetQuestionbank(id).then(res => {
    Object.keys(model.value).forEach(item => {
      model.value[item] = res[item]
    })
  })
}
// 提交
const handleSubmit = () => {
  Bus.emit('handleSubmit')
}

onMounted(() => {
  getDetail()
})
</script>

<style lang="scss" scoped>
.question-bank-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__header {
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid #d3d3de;
    text-align: center;
    font-size: 16px;
    color: #333333;
    margin-bottom: 10px;
    font-weight: 600;
  }
  &__main,
  .item {
    flex: 1;
    padding: 20px;
    &__title {
      color: #333333;
      font-weight: 600;
      margin-bottom: 10px;
    }
    &__content {
      color: #4d4e54;
      margin-bottom: 28px;
    }
  }
  &__footer,
  .submit-btn {
    width: 100%;
    height: 54px;
    text-align: center;
    border-radius: 2px;
    font-size: 16px;
    text-align: right;
    img {
      margin-right: 5px;
    }
  }
}
</style>
