<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(list,index) in lists" :key="index" :to="{ path: list.path }">{{list.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts" name="NavBread">
import { ArrowRight } from '@element-plus/icons-vue'
defineProps<{
  lists:Object //传入一个数组对象{name:'',path:''}
}>()
</script>

<style scoped>
.el-menu {
  border-right: unset !important;

}
</style>
