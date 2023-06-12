<template>
  <div class="blog-content" v-if="item">
    <div :class="{'blog-content__left': true, 'w-580': item.image}">
      <div class="text-overflow blog-title" @click="jumpPage(`/blogDetail/${item.id}`)">
        <span class="hover">{{item.title}}</span>
      </div>
      <div
        class="text-overflow blog-desc hover"
        @click="jumpPage(`/blogDetail/${item.id}`)"
      >{{item.content}}</div>
      <div class="blog-tool">
        <!-- 博主信息 -->
        <div class="blog-tool__left">
          <ComUser :userId="item.author_id" style="margin-right: 20px;" />
          <span class="blog-date">{{item.create_day}}</span>
        </div>
        <div class="blog-tool__right">
          <!-- 浏览 -->
          <div class="hover" @click="jumpPage(`/blogDetail/${item.id}`)">
            <img src="@/assets/img/blog-index/view.png" />
            <span>{{item.browse_count}}</span>
          </div>
          <!-- 评论 -->
          <div class="hover" @click="jumpPage(`/blogDetail/${item.id}`)">
            <img src="@/assets/img/blog-index/comment.png" />
            <span>{{item.comment_count}}</span>
          </div>
          <!-- 点赞 -->
          <div class="hover" @click="handleLinkAdd(item.id)">
            <img v-if="item.like_flag" src="@/assets/img/blog-index/like-hover.png" />
            <img v-else src="@/assets/img/blog-index/like.png" />
            <span>{{item.like_count}}</span>
          </div>
          <!-- 收藏 -->
          <div class="hover" @click="handleCollectAdd(item.id)">
            <img v-if="item.star_flag" src="@/assets/img/blog-index/star-hover.png" />
            <img v-else src="@/assets/img/blog-index/star.png" />
            <span>{{item.star_count}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="blog-content__right" v-if="item.image">
      <!-- 博文封面 -->
      <el-image :src="item.image" fit="contain"></el-image>
    </div>
  </div>
</template>

<script setup name="BlogListCell">
import ComUser from '@/components/ComUser.vue'

import useBlog from '@/hooks/useBlog.js'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  index: Number
})

const { handleLike, handleCollect, getBlogDetail } = useBlog()
const emits = defineEmits(['handleUpdate'])

const router = useRouter()
const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

// 点赞
const handleLinkAdd = id => {
  handleLike(id).then(async () => {
    const detail = await getBlogDetail(id)
    emits('handleUpdate', props.index, { like_flag: detail?.like_flag || 0, like_count: detail?.like_count || 0 })
  })
}

// 收藏
const handleCollectAdd = id => {
  handleCollect(id).then(async () => {
    const detail = await getBlogDetail(id)
    emits('handleUpdate', props.index, { star_flag: detail?.star_flag || 0, star_count: detail?.star_count || 0 })
  })
}
</script>

<style lang="scss" scoped>
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.blog-content {
  display: flex;
  padding: 30px 0;
  border-bottom: 1px solid rgba(200, 200, 219, 0.5);
  color: #333;
  &__left {
    flex: 1;
    max-width: 100%;
    &.w-580 {
      max-width: 580px;
    }
    .blog-title {
      font-size: 18px;
      line-height: 25px;
      margin: 6px 0 10px;
      span {
        font-weight: 600;
        &:hover {
          color: #0175ff;
        }
      }
    }
    .blog-desc {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 18px;
      color: #6d717d;
    }
    .blog-tool {
      display: flex;
      justify-content: space-between;
      height: 32px;
      &__left {
        display: flex;
        align-items: center;
        .blog-avatar {
          width: 32px;
          height: 32px;
          margin-right: 12px;
          border-radius: 32px;
          overflow: hidden;
          background-color: #efefef;
          background-position: center;
          background-size: contain;
        }
        .blog-username {
          font-size: 14px;
          margin-right: 20px;
        }
        .blog-date {
          font-size: 14px;
          color: #9196a6;
        }
      }
      &__right {
        display: flex;
        align-items: center;
        div {
          display: flex;
          align-items: center;
          margin-left: 16px;
          font-size: 14px;
          color: #9196a6;
          img {
            width: 18px;
            height: 18px;
            margin-right: 2px;
          }
        }
      }
    }
  }
  &__right {
    width: 180px;
    margin-left: 20px;
    line-height: 0;
    .el-image {
      width: 180px;
      height: 112px;
      border-radius: 4px;
    }
  }
}
</style>
