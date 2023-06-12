<template>
  <div class="header">
    <router-link to="" class="logo">
      <img src="@/assets/img/index/logo.png" />
    </router-link>
  </div>
</template>
<script setup>
</script>

<style scoped lang="scss">
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(156, 172, 209, 0.3);
  height: 64px;
  display: flex;
  align-items: center;
  .logo {
    height: 100%;
    margin-left: 40px;
    display: flex;
    width: 202px;
    align-items: center;
    &:hover {
      background-color: white;
    }
  }
}
</style>