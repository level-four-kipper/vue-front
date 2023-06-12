<template>
  <div>
    <!-- tab -->
    <TabSubTab :list="tabList" @handleClick="handleTabClick" />
    <!-- 内容 -->
    <div class="main">
      <!-- 列表 -->
      <BlogList v-if="tab.index === 0" :tabLabel="tabLabel" :menuIndex="menuIndex" @handleAction="handleAction" />
      <QuizList v-else-if="tab.index === 1" :tabLabel="tabLabel" :menuIndex="menuIndex" />
      <AnswerList v-else-if="tab.index === 2" :tabLabel="tabLabel" :menuIndex="menuIndex" @handleAction="handleAction" />
      <QsBankList v-else-if="tab.index === 3" :tabLabel="tabLabel" :menuIndex="menuIndex" @handleAction="handleAction" />
      <QsList v-else-if="tab.index === 4" :tabLabel="tabLabel" :menuIndex="menuIndex" @handleAction="handleAction" />
      <!-- <div v-else>敬请期待...</div> -->
    </div>
  </div>
</template>

<script setup>
import TabSubTab from './TabSubTab.vue'
import TabHeader from './TabHeader.vue'
import BlogList from './BlogList.vue'
import QuizList from './QuizList.vue'
import AnswerList from './AnswerList.vue'
import QsBankList from './QsBankList.vue'
import QsList from './QsList.vue'

const props = defineProps({
  menuList: { type: String },
  menuIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['updateSidebar'])

const route = useRoute()
const tab = reactive({
  index: Number(route.query.tabIndex) || 0,
  subIndex: 0
})

const tabList = computed(() => {
  const list = [0, 1].includes(props.menuIndex)
    ? [
        { label: '博客', value: 0 },
        { label: '提问', value: 1 },
        { label: '回答', value: 2 },
        { label: '题库', value: 3 },
        { label: '题目', value: 4 }
      ]
    : [{ label: props.menuList[props.menuIndex].label, value: 0 }]
  return list
})
const tabLabel = ref(tabList.value[tab.index].label)
const totalNum = ref(0)
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
})

// tab点击返回 {index, subIndex, label}
const handleTabClick = e => {
  tab.index = e.index
  tab.subIndex = e.subIndex
  tabLabel.value = e.label
}

// 点赞，收藏操作，需要更新右侧数据
const handleAction = () => {
  emit('updateSidebar')
}
</script>

<style lang="scss" scoped>
.main {
  width: 910px;
  margin: 20px auto;
}
</style>
