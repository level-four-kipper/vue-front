<template>
  <div class="answer-action answer-top">
    <div @click="toggleLike(answer, 3)">
      <img v-show="!answer.like_flag" src="@/assets/img/approval.png" alt="赞同" />
      <img v-show="answer.like_flag" src="@/assets/img/approvaled.png" alt="已赞同" />
      <span :class="[answer.like_flag?'answer-active':'']">赞同 {{ answer.like_count }}</span>
    </div>
    <div @click="toggleCollect(answer, 3)" class="answer-left">
      <img v-show="!answer.star_flag" src="@/assets/img/collect.png" alt="收藏" />
      <img v-show="answer.star_flag" src="@/assets/img/collected.png" alt="已收藏" />
      <span :class="[answer.star_flag?'answer-active':'']">收藏 {{ answer.star_count }}</span>
    </div>
    <div class="answer-right" v-show="!answer.commenting" @click="showComment(answer)">
      <img src="@/assets/img/comment.png" alt="评论" />
      <span>评论</span>
    </div>
    <div class="answer-right" v-show="answer.commenting" @click="hideComment">
      <img src="@/assets/img/commenting.png" alt="收起评论" />
      <span :class="[answer.commenting?'answer-active':'']">收起评论</span>
    </div>
  </div>
</template>

<script setup name="AnswerDetail">
const props = defineProps({
  answer: {
    type: Boolean
  }
})

const emit = defineEmits(['toggleLike', 'toggleCollect', 'showComment', 'hideComment'])

const showComment = () => {
  emit('showComment')
}

const hideComment = () => {
  emit('hideComment')
}

const toggleLike = () => {
  emit('toggleLike')
}

const toggleCollect = () => {
  emit('toggleCollect')
}
</script>

<style lang="scss" scoped>
.answer-top {
  margin-top: 20px;
}
.answer-left {
  margin-left: 20px;
}
.answer-right {
  display: flex;
  margin-left: auto;
}
.answer-action {
  color: #9196a6;
  display: flex;
  font-size: 14px;
  line-height: 20px;
  img {
    width: 18px;
    height: 18px;
    margin-right: 4px;
    border-radius: 50%;
    vertical-align: sub;
  }
}
.answer-active {
  color: #0175ff;
}
</style>
