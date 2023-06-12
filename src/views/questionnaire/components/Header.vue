<template>
  <div class="header">
    <img :src="logo" />
  </div>
</template>
<script setup name="Header">
import logo from "@/assets/img/survey-logo.png";
</script>
<style lang="scss" scoped>
.header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 54px;
    box-shadow: 0 2px 10px #eaeaea;
    background: #fff;
    z-index: 100;
    img {
        position: absolute;
        left: 190px;
        top: 1px;
        height: 52px;
    }
}
</style>