<template>
  <div class="content">
    <div class="content__left">
      <span>上月</span>
      <span class="count">{{ monthNumber }}</span>
      <img v-if="monthTrend > 0" src="@/assets/img/createQuestionBank/up.png" />
      <img v-else-if="monthTrend < 0" src="@/assets/img/createQuestionBank/drop.png" />
    </div>
    <div class="content__line"></div>
    <div class="content__right">
      <span>昨日</span>
      <span class="count">{{ dayNumber }}</span>
      <img v-if="dayTrend > 0" src="@/assets/img/createQuestionBank/up.png" />
      <img v-else-if="dayTrend < 0" src="@/assets/img/createQuestionBank/drop.png" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  monthNumber: {
    type: Number,
    default: 0
  },
  dayNumber: {
    type: Number,
    default: 0
  },
  dayTrend: {
    type: Number,
    default: 0
  },
  monthTrend: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: #fff;
  &__left,
  &__right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      line-height: 22px;
      font-size: 16px;
      color: #6d717d;
    }
    .count {
      line-height: 28px;
      margin: 0 6px 0 10px;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
    img {
      width: 18px;
      height: 18px;
    }
  }
  &__line {
    width: 1px;
    height: 21px;
    // margin: 0 46px 0 35px;
    background: #e3e3ed;
  }
}
</style>
