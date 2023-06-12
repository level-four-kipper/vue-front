<template>
  <div class="content">
    <div class="content-container">
      <!-- 侧边菜单 -->
      <div class="aside">
        <PersonalCard></PersonalCard>
        <CreationLeftMenu :list="menuList"></CreationLeftMenu>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import CreationLeftMenu from '@/views/creation/components/CreationLeftMenu.vue'
import PersonalCard from './components/PersonalCard.vue'
const route = useRoute()
const searchValue = ref('')

const menuList = [
  { label: '看板', path: '/creationList/board' },
  { label: '博客', path: '/creationList/blog' },
  { label: '提问', path: '/creationList/question' },
  { label: '回答', path: '/creationList/answer' },
  { label: '题库', path: '/creationList/quizBank' }
]

// 提供searchValue
const updateSearchValue = value => {
  searchValue.value = value
}
watch(route, () => {
  searchValue.value = ''
})
provide('searchValue', { searchValue, updateSearchValue })
</script>

<style lang="scss" scoped>
.content {
  background-color: #f5f8fe;
  padding: 40px 0px;
  .content-container {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    .main {
      display: flex;
      background: #f5f8fe;
      width: 910px;
      padding-left: 30px;
      .content-left {
        flex: 1;
      }
      .content-right {
        width: 260px;
        margin-left: 30px;
      }
    }
  }
}
</style>
