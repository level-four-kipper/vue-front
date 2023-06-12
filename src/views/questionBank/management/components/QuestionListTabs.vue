<template>
  <div class="custom-tabs">
    <el-tabs v-model="activeName" stretch @tab-change="emit('handleStatusChange', activeName)">
      <el-tab-pane
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      >
        <QuestionEditList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import QuestionEditList from './QuestionEditList'

const props = defineProps({
  status: {
    type: Number,
    default: 1
  },
  keyword: {
    type: String,
    default: ''
  },
  questionList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:status', 'update:keyword', 'handleQuestionClick', 'handleStatusChange'])

const activeName = ref(props.status)
const searchVal = ref(props.keyword)
const statusOptions = [
  { label: '已收录', value: 1 },
  { label: '审核中', value: 2 },
  { label: '已拒绝', value: 3 }
]
</script>

<style lang="scss" scoped>
.custom-tabs {
  font-size: 14px;
  color: #4d4e54;
  :deep(.el-tabs) {
    .el-tabs__item {
      height: 49px;
      line-height: 49px;
      font-size: 14px;
      color: #6d717d;
      &.is-active::after {
        position: absolute;
        content: '';
        left: 50%;
        bottom: 0;
        width: 16px;
        height: 3px;
        transform: translateX(-50%);
        background: #0175ff;
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__content {
      padding: 0 20px;
    }
  }
}
</style>
