<template>
  <div class="content">
    <div class="content__title">当前总数</div>
    <div class="content__number">
      <CountTo :startVal="0" :endVal="number" :decimals="0" separator :duration="2000" />
    </div>
    <div class="content__line"></div>
    <img class="content__icon" src="@/assets/img/createQuestionBank/total.png" />
  </div>
</template>

<script setup>
import { CountTo } from 'vue3-count-to'
const props = defineProps({
  number: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  color: #fff;
  &__title {
    line-height: 25px;
    font-size: 18px;
  }
  &__number {
    line-height: 50px;
    margin: 10px 0 20px;
    font-size: 36px;
    font-weight: 600;
  }
  &__line {
    width: 30px;
    height: 4px;
    background: #fff;
  }
  &__icon {
    position: absolute;
    top: 5px;
    right: 15px;
    width: 50px;
    height: 50px;
  }
}
</style>
