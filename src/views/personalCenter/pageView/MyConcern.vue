<template>
  <div>
    <!-- tab -->
    <TabSubTab :list="[{ label: '我的关注', value: 0 }]" />
    <!-- 内容 -->
    <div class="main">
      <FansList tabLabel='关注'></FansList>
    </div>
  </div>
</template>

<script setup>
import TabSubTab from '../components/TabSubTab.vue'
import FansList from '../components/FansList.vue'

const route = useRoute()
const totalNum = ref(0)
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
}
</style>