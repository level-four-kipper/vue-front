<template>
  <div>
    <NavBread :lists="lists"></NavBread>
  </div>
</template>

<script setup>
  import NavBread from "@/components/NavBread.vue";
   import {ref} from 'vue'
  let lists=ref<Array>('')
  lists=[{name:'设置',path:'/controlPanel'},
         {name:'通知',path:'/controlPanel/setInform'}]
</script>

<style scoped>
  .el-menu {
    border-right: unset !important;
  }
</style>
