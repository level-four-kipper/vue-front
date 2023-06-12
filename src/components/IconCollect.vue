<template>
  <span class="collect">
    <img src="@/assets/img/collected.png" alt="已收藏" />
  </span>
</template> 

<script setup>  
 
</script>

<style lang="scss" scoped>
.collect {
  &:hover {
    cursor: pointer;
    &::after {
      z-index: 999;
      content: '取消收藏';
      display: inline-block;
      position: absolute;
      top: -3px;
      left: 26px;
      width: 62px;
      height: 22px;
      background-color: rgba(0, 0, 0);
      opacity: 0.2;
      border-radius: 2px;
      font-weight: 400px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 22px;
    }
  }
}
</style>