<template>
  <div class="form">
    <p class="form__title">审核意见</p>
    <el-input
      class="form__input"
      v-model="inputVal"
      type="textarea"
      placeholder="请输入审核意见"
      resize="none"
      :disabled="question_dtolist[activeIndex]?.status_id !== 0"
    />
    <div class="form__btns">
      <template v-if="question_dtolist[activeIndex]?.status_id === 0">
        <span @click="emit('handlePass', inputVal)">通过</span>
        <span class="btn--nopass" @click="emit('handleRefuse', inputVal)">拒绝</span>
      </template>
      <span class="btn--success" v-else-if="question_dtolist[activeIndex]?.status_id === 1">通过</span>
      <span class="btn--fail" v-else>拒绝</span>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['handlePass', 'handleRefuse'])

const inputVal = ref('')
const { activeIndex, question_dtolist } = inject('questionBank')
</script>

<style lang="scss" scoped>
.form {
  height: 192px;
  padding: 20px;
  font-size: 14px;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  &__title {
    line-height: 20px;
    font-weight: 600;
    color: #333;
  }
  &__input {
    margin: 10px 0 12px;
    :deep(.el-textarea__inner) {
      height: 68px;
    }
  }
  &__btns {
    display: flex;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 32px;
      line-height: 20px;
      margin-right: 16px;
      font-weight: 500;
      border: 1px solid #0175ff;
      background: #0175ff;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        opacity: 0.85;
      }
    }
    .btn--nopass {
      background: #fff;
      border-color: #da3939;
      color: #da3939;
    }
    .btn--success {
      background: #fff;
      border-color: transparent;
      color: #0175ff;
    }
    .btn--fail {
      background: #fff;
      border-color: transparent;
      color: #da3939;
    }
  }
}
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  cursor: auto;
}
</style>
