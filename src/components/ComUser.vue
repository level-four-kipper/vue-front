<template>
  <div>
    <el-popover :show-arrow="false" @before-enter="handleBeforeEnter" popper-style="width: auto;padding: 0;border-width: 0;background: none;box-shadow: none;border-radius: 0;">
      <template #reference>
        <!-- 用户昵称及头像 -->
        <div class="user">
          <div class="user-avatar hover">
            <img v-if="userInfo.img_url" class="el-image" :src="userInfo.img_url" />
            <img v-else class="el-image" src="@/assets/img/blog-index/default-avatar.png" />
          </div>
          <div class="user-name hover">{{userInfo.username}}</div>
          <!-- <img class="user-grade" src="@/assets/img/blog-index/new-log.png" alt="grade" /> -->
          <div class="user-blogger" v-if="authorId === userId">
            <span>作者</span>
          </div>
        </div>
      </template>
      <template #default>
        <div class="author">
          <div class="author__info">
            <img class="author-avatar" :src="userInfo.img_url || BlogIndexDefaultAvatar" />
            <div>
              <div class="author-name">{{userInfo.username}}</div>
              <div class="author-desc text-overflow">{{userInfo.intro || 'TA还没想好写什么...'}}</div>
            </div>
          </div>
          <div class="author__achievement">
            <div>
              <span>{{userInfo.article_count}}</span>
              <p>创作</p>
            </div>
            <div>
              <span>{{userInfo.followsNumber}}</span>
              <p>粉丝</p>
            </div>
            <div>
              <span>{{userInfo.like_count}}</span>
              <p>点赞</p>
            </div>
          </div>
          <div class="author__btns">
            <div :class="{'author-follow': true, 'hover-btn': true, 'is-fllower': userInfo.followFlag}" v-if="!userInfo.authorFlag" @click="handleFollow(userId)">
              <template v-if="!userInfo.followFlag">
                <img src="@/assets/img/blog-index/focus-icon.png" />
                <span>关注</span>
              </template>
              <span v-else>已关注</span>
            </div>
            <div class="author-tohome hover-btn" @click="jumpPage(`/authorIndex/${userId}`)">
              <img src="@/assets/img/blog-index/home-icon.png" />
              <span>查看主页</span>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup name="ComUser">
import { ElMessage } from 'element-plus'

import { fetchBlogFollowFlag, fetchBloggerFollow, fetchBlogFollowersNumber } from '@/api/blog.js'
import { fetchUserDetail, fetchGatherInfoPopularity } from '@/api/authorSpace.js'
import { fetchBlogTouristView } from '@/api/blog.js'

const props = defineProps({
  userId: {
    // 用户id
    type: String,
    default: ''
  },
  authorId: {
    // 作者id，评论时使用+
    type: String,
    default: ''
  }
})

const router = useRouter()
// 用户信息
const userInfo = reactive({
  username: '',
  intro: '',
  img_url: '',
  article_count: 0,
  followsNumber: 0,
  like_count: 0,
  followFlag: false,
  authorFlag: false
})

const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

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
      userInfo.authorFlag = res.data.author_flag
      userInfo.followFlag = res.data.follow_flag
    }
  })
}

// 获取粉丝数量
const handleGetFollowerNumber = authorId => {
  const formData = new FormData()
  formData.append('authorId', authorId)
  fetchBlogFollowersNumber(formData).then(res => {
    if (res.code === 0) {
      userInfo.followsNumber = res.data.followers_number
    }
  })
}

// 获取用户信息
const handleGetUserInfo = authorId => {
  fetchUserDetail(authorId).then(res => {
    if (res.code === 0) {
      userInfo.username = res.data.username
      userInfo.img_url = res.data.img_url
      userInfo.intro = res.data.intro
    }
  })
}

// 获取创作数量
const handleGetBlogNumber = authorId => {
  fetchBlogTouristView({
    curr_page: 1,
    entity: {
      creator: authorId,
      domain_id: '',
      keywords: ''
    },
    page_size: 1
  }).then(res => {
    userInfo.article_count = res.data.total_count
  })
}

// 获取点赞信息
const handleGetLikeCount = authorId => {
  fetchGatherInfoPopularity(authorId).then(res => {
    userInfo.like_count = res.data.like_count
  })
}

// 显示前请求数据
const handleBeforeEnter = () => {
  handleIsAuthor(props.userId)
  handleGetFollowerNumber(props.userId)
  handleGetBlogNumber(props.userId)
  handleGetLikeCount(props.userId)
}

onMounted(() => {
  handleGetUserInfo(props.userId)
})
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
    max-width: 84px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hover-title {
  user-select: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
.hover-btn {
  user-select: none;
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.author {
  box-sizing: border-box;
  width: 270px;
  height: 227px;
  background: #fff;
  box-shadow: 0 4px 20px 0 rgba(112, 125, 153, 0.4);
  border-radius: 8px;
  overflow: hidden;
  &__info {
    display: flex;
    align-items: center;
    height: 84px;
    padding: 17px 20px 13px;
    background-image: linear-gradient(135deg, #eefeff 0%, #edf5ff 100%);
    margin: 0 0 20px 0;
    .author-avatar {
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
    .author-name {
      margin-bottom: 9px;
      line-height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .author-desc {
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
    padding: 0 20px;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 105px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #0175ff;
      &.author-follow {
        background: #0175ff;
        color: #fff;
        &.is-fllower {
          background: #fff;
          border-color: #6d717d;
          color: #6d717d;
        }
      }
      &.author-tohome {
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
</style>
