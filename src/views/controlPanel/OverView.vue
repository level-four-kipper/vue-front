<template>
  <div>
    <div class="nav-bread">
      <NavBread :lists="lists"></NavBread>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NavBread from "@/components/NavBread.vue";
  import {ref} from 'vue'
  let lists=ref<object[]>([{name:'概况',path:''}])
</script>

<style scoped>
  .el-menu {
    border-right: unset !important;
  }
  .nav-bread{
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(226, 223, 223);
}
</style>
