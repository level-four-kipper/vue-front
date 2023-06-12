<template>
  <div>
    <span class="hover" @click="changeReplay">
      <img class="action-img" src="@/assets/img/comment.png" alt="回复" />
      <span>回复</span>
    </span>
    <span class="action-left hover" @click="toggleLike">
      <img class="action-img" v-show="!status" src="@/assets/img/approval.png" alt="赞同" />
      <img class="action-img" v-show="status" src="@/assets/img/approvaled.png" alt="已赞同" />
      <span :class="[status?'action-active':'']"> {{ count>0 ? count : '赞'}}</span>
    </span>
  </div>
</template>

<script setup name="ReplayAction">
const props = defineProps({
  status: {
    type: Boolean,
    default: () => {}
  },
  count: {
    type: Number,
    default: () => {}
  }
})

const emit = defineEmits(['changeReplay', 'toggleLike'])

const toggleLike = () => {
  emit('toggleLike')
}

const changeReplay = () => {
  emit('changeReplay')
}
</script>

<style lang="scss" scoped>
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
span,
img {
  vertical-align: middle;
  color: #9196a6;
}
img {
  margin-right: 2px;
}
.action-left {
  margin-left: 20px;
}
.action-img {
  width: 18px;
  height: 18px;
  display: inline-block;
}
.action-active {
  color: #0175ff;
}
</style>
