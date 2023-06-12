<template>
  <div class="container" :class="{'dis-bottom-info':route.path.includes('workbench')}">
    <div class="main">
      <div class="content">
        <div class="content-left">
          <div class="author-avatar">
            <el-image :src="user?.img_url" fit="contain" />
            <img v-if="user?.teamFlag" src="@/assets/img/authorPhoto/team-icon.png" />
          </div>
          <div class="author-info">
            <div class="author-info-name">{{user?.username}}</div>
            <div class="author-info-desc">
              <!-- <span>团队</span>
              <span>|</span>-->
              <span>{{user?.intro || 'TA还没想好写什么...'}}</span>
            </div>
          </div>
        </div>
        <div class="content-right">
          <!-- <div>
          <div class="number">1824</div>
          <div class="name">积分</div>
        </div>
        <div>
          <div class="number">10</div>
          <div class="name">等级</div>
          </div>-->
          <div>
            <div class="number">{{followersNumber}}</div>
            <div class="name">粉丝</div>
          </div>
          <div>
            <div class="number">{{followingNumber}}</div>
            <div class="name">关注</div>
          </div>
        </div>
      </div>
      <div v-if="!route.path.includes('workbench') " class="bottom-info">
        <div class="left">
          <img src="@/assets/img/personalCenter/address.png" />
          <span>{{user?.office_space}}</span>

          <img src="@/assets/img/personalCenter/people-gray.png" />
          <span>{{user?.name}}</span>
          <span>|</span>

          <span>{{`${user?.department}-${user?.office}`}}</span>
        </div>
        <div class="right" v-if=" route.path.includes('authorIndex')  ">
          <button v-if="!followFlag" @click="updateFollower">{{`+ 关注TA`}}</button>
          <button v-else @click="updateFollower" class="dis-follow">{{`已关注`}}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { fetchFollowFlag, fetchFollowersNumber, fetchFollow, fetchUserDetail } from '@/api/authorSpace.js'
import { useLoginStore } from '@/stores/login.js'
import { fetchFansList, fetchConcernList, fetchUpdateFollower } from '@/api/personalCenter.js'

const loginStore = useLoginStore()
const { id } = storeToRefs(loginStore)
const route = useRoute()
const userId = computed(() => {
  return route.params.id || id.value
})
const user = ref(null)
const authorFlag = ref(false)
const followFlag = ref(false)
const followersNumber = ref(0)
const followingNumber = ref(0)

// 用户信息
const handleGetUser = () => {
  fetchUserDetail(userId.value).then(res => {
    if (res.code === 0) {
      user.value = res.data
    }
  })
}

// 是否是作者
const handleIsAuthor = () => {
  fetchFollowFlag(userId.value).then(res => {
    if (res.code === 0) {
      authorFlag.value = res.data.author_flag
      followFlag.value = res.data.follow_flag
    }
  })
}

// 关注
const handleFollow = () => {
  const formData = new FormData()
  formData.append('authorId', userId.value)
  fetchFollow(formData).then(res => {
    if (res.code === 0) {
      handleIsAuthor()
      handleFollowers()
    }
  })
}
// 更新关注
const updateFollower = () => {
  const formData = new FormData()
  formData.append('authorId', user.value?.id)
  fetchUpdateFollower(formData).then(res => {
    if (res.code === 0) {
      handleIsAuthor()
    } else {
      ElMessage.error('操作失败')
    }
  })
}

// 获取粉丝数
const handleFollowers = () => {
  const formData = new FormData()
  formData.append('authorId', userId.value)
  fetchFollowersNumber(formData).then(res => {
    if (res.code === 0) {
      followersNumber.value = res.data.followers_number
      followingNumber.value = res.data.following_number
    }
  })
}

onMounted(() => {
  handleGetUser()
  handleIsAuthor()
  handleFollowers()
})
defineExpose({
  handleGetUser
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-width: 1200px;
  height: 200px;
  background-image: url('../../../assets/img/authorPhoto/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  // padding: 32px 0 20px;
  &.dis-bottom-info {
    height: 180px;
    .main {
      .content {
        height: 100%;
      }
    }
  }
  .main {
    height: 100%;
    width: 1200px;
    margin: 0 auto;
    .content {
      display: flex;
      height: 148px;
      align-items: center;
      justify-content: space-between;
      width: 1200px;
      margin: 0 auto;
      &-left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .author-avatar {
          position: relative;
          width: 88px;
          height: 88px;
          .el-image {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            border: 2px solid #fff;
          }
          img {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 22px;
          }
        }
        .is-followed {
          border-color: #eef3fd;
          background: #eef3fd;
          color: #333;
        }
        .author-info {
          margin-left: 20px;
          color: #333;
          &-name {
            line-height: 28px;
            margin-bottom: 10px;
            font-size: 20px;
            font-weight: 600;
          }
          &-desc {
            line-height: 20px;
            margin-bottom: 12px;
            font-size: 14px;
          }
          &-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 92px;
            height: 32px;
            border: 1px solid #0175ff;
            border-radius: 4px;
            color: #0175ff;
            &.is-followed {
              border-color: #eef3fd;
              background: #eef3fd;
              color: #333;
            }
            &:hover {
              cursor: pointer;
              opacity: 0.85;
            }
            span {
              font-size: 14px;
              line-height: 20px;
              &.icon {
                font-size: 18px;
                text-align: center;
                height: 22px;
                margin-right: 4px;
              }
            }
          }
        }
      }
      &-right {
        display: flex;
        align-items: center;
        justify-content: center;
        & > div {
          margin-left: 45px;
          text-align: center;
          .number {
            line-height: 33px;
            margin-bottom: 10px;
            font-size: 24px;
            font-weight: 600;
            color: #333;
          }
          .name {
            line-height: 20px;
            font-size: 14px;
            color: #6d717d;
          }
        }
      }
    }
    .bottom-info {
      display: flex;
      align-items: center;
      color: #6d717d;
      justify-content: space-between;
      span {
        margin-right: 4px;
      }
      img {
        margin-right: 4px;
        height: 18px;
        width: 18px;
      }
      .left {
        display: flex;
        align-items: center;
        span:nth-child(2) {
          margin-right: 30px;
        }
      }

      button {
        cursor: pointer;
        width: 92px;
        height: 32px;
        background: #0175ff;
        border-radius: 4px;
        outline: none;
        border: none;
        color: #fff;
        &.dis-follow {
          background: #fff;
          color: #333;
        }
      }
    }
  }
}
</style>
