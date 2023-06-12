<template>
  <!-- 编辑 - 题目状态列表 -->
  <el-tabs v-model="currentTab" stretch class="topic-status-list" @tab-change="handelTabChange">
    <el-tab-pane v-for="item in topicStatusOptions" :key="item.value" :label="item.label" :name="item.value">
      <SearchBox ref="searchRef" v-model:keyword="searchVal" placeholder="搜索题目" />
      <div class="topic-total">共计{{ topicList.length }}条</div>
      <div class="topic-list">
        <div v-for="i in topicListComputed" :key="i.id" class="topic-list__cell" @click.stop="emit('topicClick', i.id)">
          {{ i.title }}
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import SearchBox from './SearchBox.vue'

import _ from 'lodash'
import useQuestionbank from '@/hooks/useQuestionbank.js'

const emit = defineEmits(['topicClick'])

const route = useRoute()

const searchVal = ref('')
const searchRef = ref()
const currentTab = ref(1)
const topicStatusOptions = [
  { label: '已收录', value: 1 },
  { label: '审核中', value: 0 },
  { label: '已拒绝', value: 2 },
]
const { topicList, _fetchGetTopicList } = useQuestionbank()

const topicListComputed = computed(() => {
  if (!searchVal.value) {
    return topicList.value
  } else {
    return topicList.value.filter(item => item.title.includes(searchVal.value))
  }
})
// tab切换时，重新获取题目列表
const handelTabChange = () => {
  const { id = '' } = route.query
  _fetchGetTopicList(0, { bank_id: id, audit_status: currentTab.value, question_title: searchVal.value })
}

onMounted(() => {
  handelTabChange()
})
</script>

<style lang="scss" scoped>
.topic-status-list {
  :deep(.el-tabs__header) {
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      height: 48px;
      line-height: 48px;
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
    .el-tabs__item.is-active {
      font-weight: 600;
      color: #6d717d;
    }
  }
  :deep(.el-tabs__content) {
    padding: 0 20px;
  }
}
.search-box {
  margin: 16px 0 30px;
}

.topic-total {
  line-height: 20px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
}

.topic-list {
  max-height: calc(100vh - 418px);
  overflow-y: auto;

  &__cell {
    line-height: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    cursor: pointer;

    &:hover {
      color: #0175ff;
    }
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
}

::-webkit-scrollbar-track {
  background: #f6f6f6;
}

::-webkit-scrollbar-track-piece {
  background-color: transparent;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 12px;
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 12px;
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical:hover,
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: rgba(144, 147, 153, 0.5);
}
</style>
