<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item to="/" replace>首页</el-breadcrumb-item>
    <template v-for="(item, index) in list" :key="index">
      <el-breadcrumb-item v-if="item.path" :to="item.path">{{item.name}}</el-breadcrumb-item>
      <el-breadcrumb-item v-else>{{item.name}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup name="Breakcrumb">
import { ArrowRight } from '@element-plus/icons-vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  width: 1200px;
  margin: 20px auto 0;
  line-height: 20px;
  :deep(.el-breadcrumb__inner) {
    color: #333;
  }
  :deep(.is-link) {
    font-weight: normal;
    color: #9196a6;
  }
}
</style>
