<template>
  <div class="common-layout">
    <!-- <el-container class="m-container">
      <el-header class="m-header"><Header /></el-header> -->
    <el-container class="m-container-cnt">
      <el-aside class="m-aside">
        <div class="person">
          <div class="img"><img :src="avatar" /></div>
          <div class="name">{{username}}</div>
        </div>
        <Menu :menuList="menuList" class="menu"> </Menu>
      </el-aside>
      <div class="m-content">
        <router-view :key="route.fullPath"></router-view>
      </div>
      <!-- </el-container> -->
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Menu from '@/components/Menu.vue'
// import Header from "@/components/Header.vue";
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import u4212 from '@/assets/img/u4212.png'
import u4215 from '@/assets/img/u4215.png'
import u4218 from '@/assets/img/u4218.png'
import u730 from '@/assets/img/u730.png'

import { useLoginStore } from '@/stores/login.js'

const loginStore = useLoginStore()
const { avatar, username } = storeToRefs(loginStore)
const route = useRoute()

let menuList = ref<any>('')
menuList = [
  {
    label: '博客管理',
    icon: u4212,
    child: [
      { label: '我的创作', path: '/MyBlogWrite/1', icon: '' },
      { label: '我的活动', path: '/MyBlogActivity', icon: '' }
    ]
  },
  {
    label: '问答管理',
    icon: u4215,
    child: [
      { label: '我的提问', path: '/myQuestion/1', icon: '' }
      //    {label:'我的回答',path:'',icon:''}
    ]
  },
  //   {
  //     label: '题库管理',
  //     icon: 'src/assets/img/u4216.png',
  //     child: [
  //       { label: '我的题库', path: '/workPanel/myQuestionBank', icon: '' },
  //       { label: '我的题目', path: '/workPanel/myTest', icon: '' },
  //       { label: '我的审核', path: '/workPanel/myReview', icon: '' }
  //     ]
  //   },
  //   {
  //     label: '考试管理',
  //     icon: 'src/assets/img/u4217.png',
  //     child: [
  //       { label: '我的考试', path: '/workPanel/myExam', icon: '' },
  //       { label: '我的试卷', path: '/workPanel/myPaper', icon: '' }
  //     ]
  //   },
  //   {
  //     label: '考生管理',
  //     icon: 'src/assets/img/u4218.png',
  //     path: '',
  //     child: [
  //       { label: '分组管理', path: '/workPanel/group', icon: '' },
  //       { label: '考生管理', path: '/workPanel/examinee', icon: '' }
  //     ]
  //   },
  { label: '消息中心', icon: u4218, path: '', child: [{ label: '系统通知', path: '/workPanel/notification', icon: '' }] }
]
// let person = ref<object>()
// person.value = { photoSrc: u730, name: '李四' }
</script>
<style lang="scss" scoped>
.common-layout {
  height: 100%;
}
.m-container-cnt {
  height: calc(100% - 64px);
}
.m-aside {
  /* background-color: forestgreen; */
  width: 201px;
  border-right: 1px solid #ccc;
  .person {
    height: 140px;
    width: 200px;
    border-bottom: solid 1px #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 6px 0;
    .img {
      width: 60px;
      height: 60px;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
}
.m-content {
  //   padding: 50px;
  /* background-color: aqua; */
  width: 100%;
  height: calc(100vh - 64px);
  background-color: #eef3fd;
  //   height: 100%;
}
</style>
