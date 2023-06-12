<template>
  <div class="blog-author" v-if="author">
    <div class="blog-author__info">
      <!-- <img v-if="author.img_url" class="blog-author-avatar" :src="author.img_url" />
      <img v-else class="blog-author-avatar" src="../../../assets/img/blog-index/default-avatar.png" />-->
      <img class="blog-author-avatar" :src="author.img_url || BlogIndexDefaultAvatar" />
      <div>
        <div class="blog-author-name">{{author.username}}</div>
        <div :title="intro || ''" class="blog-author-desc text-overflow">{{intro || 'TA还没想好写什么...'}}</div>
      </div>
    </div>
    <div class="blog-author__achievement">
      <div>
        <span>{{author.article_count}}</span>
        <p>创作</p>
      </div>
      <div>
        <span>{{followsNumber}}</span>
        <p>粉丝</p>
      </div>
      <div>
        <span>{{author.like_count}}</span>
        <p>点赞</p>
      </div>
    </div>
    <div class="blog-author__btns">
      <div
        :class="{'blog-author-follow': true, 'hover-btn': true, 'is-fllower': followFlag}"
        v-if="!authorFlag"
        @click="handleFollow(author.id)"
      >
        <template v-if="!followFlag">
          <img src="@/assets/img/blog-index/focus-icon.png" />
          <span>关注</span>
        </template>
        <span v-else>已关注</span>
      </div>
      <div class="blog-author-tohome hover-btn" @click="jumpPage(`/authorIndex/${author.id}`)">
        <img src="@/assets/img/blog-index/home-icon.png" />
        <span>查看主页</span>
      </div>
    </div>
  </div>
  <div class="blog-author-article" v-if="author">
    <div class="blog-author-article-name">作者的文章</div>
    <div
      class="blog-author-article-title text-overflow"
      v-for="item in author.article_list"
      :key="item.id"
    >
      <span class="hover-title" @click="jumpPage(`/blogDetail/${item.id}`)">{{item.title}}</span>
    </div>
  </div>
</template>

<script setup name="BlogAuthor">
import { ElMessage } from 'element-plus'

import { fetchBlogFollowFlag, fetchBloggerFollow, fetchBlogFollowersNumber } from '@/api/blog.js'
import { fetchUserDetail } from '@/api/authorSpace.js'

const props = defineProps({
  author: {
    type: Object,
    default: () => {}
  }
})

// 是否作者
const authorFlag = ref(false)
const followFlag = ref(false)
const followsNumber = ref(0)
const router = useRouter()
const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}
// 作者介绍
const intro = ref('')

// 关注博主
const handleFollow = authorId => {
  const formData = new FormData()
  formData.append('authorId', authorId)
  fetchBloggerFollow(formData).then(res => {
    if (res.code !== 0) {
      ElMessage({
        message: '操作失败',
        type: 'warning'
      })
      return
    }
    handleIsAuthor(authorId)
    handleGetFollowerNumber(authorId)
  })
}

// 登录人员是否为博客作者
const handleIsAuthor = authorId => {
  fetchBlogFollowFlag(authorId).then(res => {
    if (res.code === 0) {
      authorFlag.value = res.data.author_flag
      followFlag.value = res.data.follow_flag
    }
  })
}

// 获取粉丝数量
const handleGetFollowerNumber = authorId => {
  const formData = new FormData()
  formData.append('authorId', authorId)
  fetchBlogFollowersNumber(formData).then(res => {
    if (res.code === 0) {
      followsNumber.value = res.data.followers_number
    }
  })
}

// 获取用户信息
const handleGetUserInfo = authorId => {
  fetchUserDetail(authorId).then(res => {
    if (res.code === 0) intro.value = res.data.intro
  })
}

watch(
  () => props.author,
  (newVal, oldVal) => {
    if (oldVal?.id !== newVal?.id) {
      handleIsAuthor(newVal.id)
      handleGetFollowerNumber(newVal.id)
      handleGetUserInfo(newVal?.id)
    }
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hover-title {
  user-select: none;
  &:hover {
    cursor: pointer;
    color: #0175ff;
  }
}
.hover-btn {
  user-select: none;
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.blog-author {
  box-sizing: border-box;
  width: 270px;
  height: 237px;
  padding: 30px 20px;
  margin-bottom: 30px;
  border-radius: 4px;
  background-image: linear-gradient(135deg, #eefeff 0%, #edf5ff 100%);
  &__info {
    display: flex;
    align-items: center;
    margin: 0 0 20px 0;
    .blog-author-avatar {
      position: relative;
      width: 54px;
      height: 54px;
      margin-right: 7px;
      border-radius: 54px;
      overflow: hidden;
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    .blog-author-name {
      margin-bottom: 9px;
      line-height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .blog-author-desc {
      font-size: 14px;
      line-height: 20px;
      color: #6d717d;
      width: 170px;
    }
  }
  &__achievement {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    div {
      flex: 1;
      text-align: center;
      span {
        font-size: 18px;
        line-height: 25px;
        color: #333;
      }
      p {
        font-size: 14px;
        line-height: 20px;
        margin-top: 6px;
        color: #6d717d;
      }
    }
  }
  &__btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 105px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #0175ff;
      &.blog-author-follow {
        background: #0175ff;
        color: #fff;
        &.is-fllower {
          background: #fff;
          border-color: #fff;
          color: #6d717d;
        }
      }
      &.blog-author-tohome {
        color: #0175ff;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      span {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
.blog-author-article {
  div {
    margin-bottom: 20px;
    color: #333;
  }
  &-name {
    line-height: 25px;
    font-size: 18px;
    font-weight: 600;
  }
  &-title {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
