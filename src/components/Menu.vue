<template>
  <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
    <template v-for="(item,index) in menuList">
      <el-sub-menu v-if="item.child" :index="index" :key="index">
        <template #title>
          <!-- <el-icon>{{item.icon}}</el-icon> -->
          <el-icon><img :src="item.icon" class="img" /></el-icon>
          <!-- <span class="img"><img :src='item.icon' ></span> -->
          <span>{{item.label}}</span>
        </template>
        <router-link v-for="(i,k) in item.child" :key="k" :to="i.path">
          <el-menu-item :index="`${index}-${k}`">
            <el-icon>{{i.icon}}</el-icon>
            <span>{{i.label}}</span>
          </el-menu-item>
        </router-link>
      </el-sub-menu>
      <router-link v-else :to="item.path" :key="`${index}.`">
        <el-menu-item index="index">
          <el-icon>{{item.icon}}</el-icon>
          <span>{{item.label}}</span>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>

<script setup name="Menu">
import {ref} from 'vue'
// import { Menu as IconMenu } from "@element-plus/icons-vue";
//   menuList{
// icon:Components
// label:String,
// child:Object
//
// }
// const props=defineProps<
// {menuList:any}>()
// console.log(props.menuList,'list');

// const handleOpen = (key, keyPath) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key, keyPath) => {
//   console.log(key, keyPath);
// };
const props=defineProps({
  menuList:Array
})
console.log('key, keyPath');
</script>

<style scoped lang="scss">
.el-menu {
  border-right: unset !important;
}
.img{
  height: 16px;
  width: 16px;
  img{
    height: 100%;
    width:100%
  }
}
</style>
