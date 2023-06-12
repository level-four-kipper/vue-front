<template>
  <!-- 顶部 -->
  <AuthorHeader ref="authorHeaderRef" :id="id" />
  <!-- 主体 -->
  <div class="main">
    <div class="content">
      <Menu @changeMenu="changeMenu" />
      <!-- <AuthorContent v-show="activePage==1 || activePage==2" class="content-left" :id="id" /> -->
      <!-- <Fans v-show="activePage==3" class="content-left" @changeMenu="changeMenu" />
      <Subscription v-show="activePage==4" class="content-left" @changeMenu="changeMenu" />
      <Notification v-show="activePage==5" class="content-left" @changeMenu="changeMenu" /> -->
      <Setting v-show="activePage==6" class="content-left" @updateUser="updateUser" />
    </div>
  </div>
</template>

<script setup>
import Menu from './components/Menu.vue'
// import Fans from './components/Fans.vue'
// import Subscription from './components/Subscription.vue'
// import Notification from './components/Notification.vue'
import Setting from './components/Setting.vue'
import AuthorHeader from '../personalCenter/components/AuthorHeader.vue'
import AuthorContent from '../personalCenter/components/AuthorContent.vue'
import { useLoginStore } from '@/stores/login.js'
const route = useRoute()
// const id = ref(route.params.id)
const loginStore = useLoginStore()
const { id } = storeToRefs(loginStore)

const activePage = ref(6)
const authorHeaderRef = ref();

const changeMenu = key => {
  activePage.value = key
}

const updateUser = () => {
  authorHeaderRef.value.handleGetUser()
}
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100vh - 264px);
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
      margin-left: 30px;
    }
  }
}
</style>
