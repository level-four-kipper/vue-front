<template>
  <div class="user">
    <div class="user-avatar hover" @click="jumpAuthor(reply?.user_id)">
      <img v-if="reply.img_url" class="el-image" :src="reply.img_url" />
      <img v-else class="el-image" src="@/assets/img/blog-index/default-avatar.png" />
      <!-- <img class="user-avatar-type" src="@/assets/img/blog-index/personal-log.png" /> -->
    </div>
    <div class="user-name hover" @click="jumpAuthor(reply?.user_id)">{{reply?.username}}</div>
    <!-- <img class="user-grade" src="@/assets/img/blog-index/new-log.png" alt="grade" /> -->
    <div class="user-blogger" v-if="reply?.user_id === userId"><span>作者</span></div>
  </div>
</template>

<script setup name="BlogCommentUser">
const props = defineProps({
  reply: {
    type: Object,
    default: () => {}
  },
  userId: String
})

const router = useRouter()
const jumpAuthor = id => {
  const routeUrl = router.resolve({
    path: `/authorIndex/${id}`
  })
  window.open(routeUrl.href, '_blank')
}
</script>

<style lang="scss" scoped>
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.user {
  display: flex;
  align-items: center;
  &-avatar {
    position: relative;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    .el-image {
      width: 32px;
      height: 32px;
      border-radius: 32px;
    }
    &-type {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 12px;
      height: 12px;
      border-radius: 12px;
    }
  }
  &-name {
    line-height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  &-grade {
    width: 18px;
    height: 18px;
    margin-left: 2px;
  }
  &-blogger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 16px;
    margin-left: 2px;
    border-radius: 2px;
    background: #eef3fd;
    background-image: linear-gradient(-270deg, #33e09f 0%, #39decd 100%);
    overflow: hidden;
    span {
      width: 40px;
      height: 28px;
      line-height: 28px;
      transform: scale(0.5);
      font-size: 20px;
      font-weight: 200;
      white-space: nowrap;
      color: #ffffff;
    }
  }
}
</style>
