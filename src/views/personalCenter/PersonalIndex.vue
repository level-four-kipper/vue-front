<template>
  <!-- 顶部 -->
  <AuthorHeader>
  </AuthorHeader>
  <div class="content">
    <div class="content-container">
      <!-- 侧边菜单 -->
      <div class="aside">
        <TabLeftMenu :list="menuList"></TabLeftMenu>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template> 

<script setup>
import AuthorHeader from './components/AuthorHeader.vue'
import SearchInput from '@/components/SearchInput.vue'
import TabLeftMenu from './components/TabLeftMenu.vue'
import AuthorContent from './components/AuthorContent.vue'
import UpdatePassword from './components/UpdatePassword.vue'

const route = useRoute()
const searchValue = ref('')

const menuList = [
  { label: '创作', path: '/personalIndex/myWriting', },
  { label: '收藏', path: '/personalIndex/myCollect', },
  { label: '粉丝', path: '/personalIndex/myFans', },
  { label: '关注', path: '/personalIndex/myConcern', },
  // { label: '消息通知', path: '/personalIndex/messageNotice', },
  // { label: '账户设置', path: '/personalIndex/setting', }
]

const updateSearchValue = (value) => {
  searchValue.value = value
}

watch(route, () => {
  searchValue.value = ''
})

// 提供searchValue全局搜索 
provide('searchValue', { searchValue, updateSearchValue })

</script>

<style lang="scss" scoped>
.content {
  background-color: #f5f8fe;
  padding: 30px 0px;
  .content-container {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    .main {
      display: flex;
      // min-height: calc(100vh - 264px);
      background: #f5f8fe;
      display: flex;
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
