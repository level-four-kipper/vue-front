<template>
  <div class="blog-head">
    <div>
      <div class="blog-title">{{article?.title}}</div>
      <div v-if="article?.star_flag" class="blog-collect-log">
        <img src="@/assets/img/blog-index/star-hover.png" />
        <span>已收藏</span>
      </div>
    </div>
    <div class="blog-info">
      <span class="is-original">{{article?.creation_type === 0 ? '原创' : '转载' }}</span>
      <span>作者：{{article?.author_info?.username}}</span>
      <span>{{article?.gmt_created}}</span>
      <span>{{article?.browse_count}}浏览</span>
      <span>{{article?.comment_count}}评论</span>
      <span>{{article?.like_count}}点赞</span>
      <span>{{article?.star_count}}收藏</span>
    </div>
  </div>
</template>

<script setup name="BlogTitle">
const props = defineProps({
  article: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.blog-head {
  text-align: center;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    .blog-title {
      display: inline-block;
      vertical-align: middle;
      font-size: 26px;
      line-height: 37px;
      font-weight: 600;
      color: #333;
    }
    .blog-collect-log {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 86px;
      height: 32px;
      margin-left: 10px;
      text-align: center;
      border: 1px solid #0175ff;
      border-radius: 4px;
      img {
        margin-right: 2px;
      }
      span {
        line-height: 20px;
        font-size: 14px;
        color: #0175ff;
      }
      img,
      span {
        font-style: normal;
      }
    }
  }
  .blog-info {
    margin-top: 20px;
    span {
      margin-left: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #9196a6;
      &.is-original {
        color: #0175ff;
      }
    }
  }
}
</style>
