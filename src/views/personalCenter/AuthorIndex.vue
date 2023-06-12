<template>
  <!-- 顶部 -->
  <AuthorHeader />
  <!-- 主体 -->
  <div class="main">
    <div class="content">
      <AuthorContent @updateSidebar="updateSidebar" class="content-left" />
      <AuthorSidebar ref="authorSidebar" class="content-right" />
    </div>
  </div>
</template>

<script setup>
import AuthorHeader from './components/AuthorHeader.vue'
import AuthorContent from './components/AuthorContent.vue'
import AuthorSidebar from './components/AuthorSidebar.vue'

const searchValue = ref('')
const authorSidebar = ref(null)
const updateSidebar = () => {
  nextTick(() => {
    authorSidebar.value.handleGetPopularity()
  })
}
// 提供searchValue
const updateSearchValue = (value) => {
  searchValue.value = value
}
provide('searchValue', { searchValue, updateSearchValue })

</script>

<style lang="scss" scoped>
.main {
  min-width: 1200px;
  // min-height: calc(100vh - 264px);
  padding: 20px 0;
  background: #f5f8fe;
  .content {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    &-left {
      flex: 1;
    }
    &-right {
      width: 260px;
      height: 561px;
      margin-left: 30px;
    }
  }
}
</style>
