<template>
  <div @click="handleUserClick" class="user-wrap">
    <!-- <img v-if="avatar" class="comment-portrait hover" :src="avatar" alt="用户头像" /> -->
    <!-- <img v-else class="comment-portrait hover" src="@/assets/img/index/g-avatar.png" alt="用户头像" /> -->
    <ComUser :userId="userid"  />
    <!-- <span class="comment-userName hover">{{ username }}</span> -->
    <slot name="user-other" @click.stop=""></slot>
    <span class="comment-time" @click.stop="" >{{ time }}</span>
  </div>
</template>

<script setup name="User">
import ComUser from '@/components/ComUser.vue'
const props = defineProps({
  username: {
    type: String,
    default: () => {}
  },
  avatar: {
    type: String,
    default: '@/assets/img/index/g-avatar.png'
  },
  time: {
    type: String,
    default: () => {}
  },
  userid:{
    type:String,
    default: () => {}
  }
})

const emit = defineEmits(['userClick'])
const handleUserClick = () => {
  console.log('点击了')
  emit('userClick')
}
</script>

<style lang="scss" scoped>
.user-wrap{
  display: flex;
}
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
span,
img {
  vertical-align: middle;
}
.comment-userName {
  font-weight: 800;
  margin-right: 10px;
}
.comment-time{
  font-size: 12px;
  color: #9196A6;
  top: 8px;
}
.comment-portrait {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
  display: inline-block;
}
.comment-levelImg {
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  width: 18px;
}
.comment-time {
  margin-left: 10px;
}
</style>
