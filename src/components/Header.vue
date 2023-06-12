<template>
  <div class="header">
    <slot name="logo">
      <router-link to="/home" class="logo">
        <img src="@/assets/img/index/logo.png" />
      </router-link>
    </slot>

    <div class="content-menu">
      <div class="menu-list">
        <div class="menu-item-container" v-for="(item, index) in menuList" :key="index" @mouseenter="handleHover(-1)">
          <span class="menu-item" :class="{ active: index === activeIndex }" @mouseenter="handleHover(index)" @click="jumpPage(item)">
            {{ item.title }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="hoverIndex !== -1 && menuList[hoverIndex].child" class="menu-child-list" @mouseleave="handleHover(-1)">
    <span
      class="menu-item"
      :class="{ active: index === activeChildIndex }"
      v-for="(i, key) in menuList[hoverIndex].child"
      :key="key"
      @click="jumpPage(i)">
      {{ i.title }}
    </span>
  </div>

  <!-- 轮播 -->
  <div header="header-container">
    <div class="header-banner">
      <el-carousel height="400px" indicator-position="none" interval="5000">
        <el-carousel-item v-for="item in bannerList" :key="item">
          <img class="banner-img" :src="item" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup name="header">
import { useCommonStore } from '@/stores/common.js'
import { useLoginStore } from '@/stores/login.js'
import { websocketMix } from '@/views/messageCenter/websocket.js'
import { watch } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

const activeIndex = ref(0)
const hoverIndex = ref(-1)
const route = useRoute()
const router = useRouter()
const activeChildIndex = ref(0)
const bannerList = ['/src/assets/img/index/banner.png', '/src/assets/img/index/banner.png', '/src/assets/img/index/banner.png']
const menuList = [
  { title: '首页', path: '/home' },
  { title: '公司介绍', path: '/introduce' },
  { title: '解决方案', path: '/solution' },
  {
    title: '成功案例',
    path: '/example',
    child: [
      { title: '智能家居', path: '/example/smartHome' },
      { title: '指挥系统', path: '/example/smartSystem' },
      { title: '智慧旅游', path: '/example/smartTravel' },
      { title: '智慧校园', path: '/example/smartSchool' },
      { title: '智慧医院', path: '/example/smartHospital' },
      { title: '智慧园区', path: '/example/smartPark' },
      { title: '智慧小区', path: '/example/smartCommunity' },
      { title: '智慧建筑', path: '/example/smartBuild' },
    ],
  },
  { title: '联系我们' },
]
const handleHover = index => {
  hoverIndex.value = index
}

const jumpPage = item => {
  router.push(item.path)
}
</script>

<style scoped lang="scss">
.header-container {
  padding: 0;
}

.header {
  width: 100%;
  // position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0);
  color: #000;
  box-shadow: 0 2px 10px 0 rgba(156, 172, 209, 0.3);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // border-bottom: 1px solid rgba(156, 172, 209, 0.3);

  .logo {
    height: 100%;
    display: flex;
    width: 202px;
    align-items: center;

    &:hover {
      background-color: white;
    }
  }

  .content-menu {
    // width: 700px;
    margin-right: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    .menu-list {
      display: flex;
      height: 64px;
      align-items: center;
      justify-content: space-between;
      .menu-item-container {
        height: 100%;
        display: flex;
        margin-right: 20px;
        align-items: center;
      }
      .menu-item {
        font-weight: 600;
        // height: 100%;
        padding: 5px 10px;
        &:hover,
        &.active {
          background-color: #4070f4;
          border-radius: 4px;
          cursor: pointer;
          color: #fff;
        }
      }
    }
  }
}

.menu-child-list {
  height: 60px;
  font-weight: 400;
  line-height: 60px;
  padding-right: 100px;
  text-align: right;
  position: absolute;
  width: 100%;
  background-color: #fff;
  top: 64px;
  box-shadow: 0 2px 10px 0 rgba(156, 172, 209, 0.3);
  z-index: 20;
  .menu-item {
    margin-right: 20px;
    &:hover {
      color: #4070f4;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
