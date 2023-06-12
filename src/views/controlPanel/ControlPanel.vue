<template>
  <!-- <div class="common-layout"> -->
  <!-- <el-container class="m-container"> -->
  <!-- <el-header class="m-header"><Header /></el-header> -->
  <el-container class="m-container-cnt">
    <el-aside class="m-aside">
      <Menu :menuList="menuList"></Menu>
    </el-aside>
    <el-main class="m-content">
      <router-view></router-view>
    </el-main>
  </el-container>
  <!-- </el-container> -->
  <!-- </div> -->
</template>
<script setup>
import { ref } from 'vue'
import Menu from '@/components/Menu.vue'
// import Header from "@/components/Header.vue";
// import SetIform from "@/components/SetIform.vue";
let menuList = ref([])
menuList.value = [
  { label: '概况', path: '/controlPanel', icon: '' },
  {
    label: '安全',
    icon: '',
    child: [
      {
        label: '用户管理',
        path: '/controlPanel/userManage',
        icon: ''
      },
      { label: '注册审核', path: '/controlPanel/registrationAudit', icon: '' }
    ]
  },
  { label: '设置', icon: '', child: [{ label: '通知', path: '/controlPanel/setInform', icon: '' }] }
]
// const onClick=()=>{
//   console.log(menuList)
//   menuList.forEach(element => {
//     console.log(element.child)
//   });
//   }
// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
</script>

<style scoped>
/* .common-layout {
  margin: 0;
  padding: 0;
  height: 100vh;
}
.m-container {
  height: 100%;
}
*/
.m-container-cnt {
  height: calc(100vh - 64px);
}

.m-aside {
  /* background-color: forestgreen; */
  margin: 50px 0;
  border-right: 1px solid #ccc;
}
.m-content {
  padding: 50px;
  height: 100%;
  /* background-color: aqua; */
}
</style>

