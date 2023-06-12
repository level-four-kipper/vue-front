<template>
  <div class="header">
    <slot name="logo">
      <router-link to="/home" class="logo">
        <img src="@/assets/img/index/logo.png" />
      </router-link>
    </slot>

    <div class="header-center">
      <slot name="left" v-if="!route.meta.hideLeft">
        <div class="module-list">
          <div v-for="(item, index) in navList" :key="index" class="index" @click="handleNavClick(index, item)">
            <span :class="{ active: index === currentIndex }">{{ item.lable }}</span>
          </div>
        </div>
      </slot>
    </div>

    <div class="content-middle">
      <slot name="right" v-if="!route.meta.hideRight">
        <div class="search" :class="{ hidden: route.meta.hideSearch }">
          <input type="text" placeholder="输入关键字搜索" v-model="searchValue" @keyup.enter="jumpSearch" />
          <img src="@/assets/img/index/g-search.png" @click="jumpSearch" />
        </div>
        <el-dropdown @command="creationClick" class="creation-popper">
          <span class="el-dropdown-link">
            <el-button class="creation-btn" type="primary">创作</el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="creation-list">
              <el-dropdown-item command="/publishBlog">写博客</el-dropdown-item>
              <el-dropdown-item command="/publishQuestion">提问题</el-dropdown-item>
              <el-dropdown-item class="border-top" command="/creationList/board">创作空间</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </slot>
    </div>

    <!-- 消息 -->
    <el-dropdown class="notice" trigger="hover">
      <div class="notice__icon">
        <img src="@/assets/img/index/g-msg.png" />
        <span :class="{ 'is-dot': getIcon(noticeTotal) === 'dot' }" class="notice__number">{{ getIcon(noticeTotal) }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, idx) in notificationType" :key="idx" :divided="idx" @click="toViewNotice(idx + 1)">
            <div class="dropdown-span">
              <span class="notice__item">
                {{ item }}
                <span v-if="idx !== 6" :class="{ 'is-dot': getIcon(notificationInfo[idx]?.num || 0) === 'dot' }">{{ getIcon(notificationInfo[idx]?.num || 0) }}</span>
              </span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 头像 -->
    <el-dropdown trigger="hover" class="person">
      <img class="avatar__image" :src="avatar" alt="头像" />
      <template #dropdown>
        <el-dropdown-menu v-if="token">
          <el-dropdown-item>
            <router-link to @click="jumpPage(`/workbench`)">
              <span class="dropdown-span" to="/control-list">我的账户</span>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <router-link to @click="jumpPage(`/personalIndex`)">
              <span class="dropdown-span">个人空间</span>
            </router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item divided v-if="role === '1'">
                        <router-link to="/controlPanel">
                            <span class="dropdown-span">控制台</span>
                        </router-link>
          </el-dropdown-item>-->
          <el-dropdown-item divided>
            <router-link to @click="jumpFeedback">
              <span class="dropdown-span">用户反馈</span>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <router-link to @click="toLogin">
              <span class="dropdown-span">退 出</span>
            </router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup name="header">
import { useCommonStore } from '@/stores/common.js'
import { useLoginStore } from '@/stores/login.js'
import { websocketMix } from '@/views/messageCenter/websocket.js'

const commonStore = useCommonStore()
const loginStore = useLoginStore()
const { token, avatar } = storeToRefs(loginStore)
const searchValue = ref('')

// 消息
const notificationType = ['点赞', '评论', '收藏', '关注', '@我', '系统'] // , '消息设置'
const notificationInfo = ref([])
const { initWebSocket, disconnect } = websocketMix(notificationInfo)
const noticeTotal = computed(() => {
  return notificationInfo.value.reduce((total, currentValue) => {
    return total + currentValue?.num || 0
  }, 0)
})

// 消息为1时显示为红色点，其余显示为数字
// a.N<1时，不显示
// b.N=1时，显示为红点
// c.N<100时，显示N
// d.N<999时，显示为 “M+”，M为N的百位数
// e.N>=999 时，显示为 “999+”
function getIcon(number) {
  if (number < 1) {
    return ''
  } else if (number == 1) {
    return 'dot'
  } else if (1 < number && number < 100) {
    return 'N'
  } else if (100 <= number && number < 999) {
    return 'M+'
  } else {
    return '999+'
  }
}
const currentIndex = ref(0)
const notificationData = ref([])
const newNotice = ref(false)
let isShowControl = ref(false)
const navList = [
  { lable: '首页', path: '/home' },
  { lable: '博客', path: '/blogIndex' },
  { lable: '问答', path: '/quizIndex' },
  { lable: '题库', path: '/questionBank/index' }
  // { lable: '考试', path: '/exam' }
  // {lable: '资料', route: '/'},
]
const handleNavClick = (index, item) => {
  currentIndex.value = index
  router.push({ path: item.path })
}

const jumpSearch = () => {
  commonStore.updateSearchWord(searchValue.value)
  searchValue.value = '' 
  router.push('/search')
}
function jumpPage(path) {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

const router = useRouter()
const route = useRoute()

watch(
  route,
  to => {
    currentIndex.value = to.meta.navIndex
  },
  {
    immediate: true
  }
)
const creationClick = path => {
  jumpPage(path)
}
function toViewNotice(idx) {
  let tabIndex = idx
  if (idx > notificationInfo.value.length) {
    tabIndex = 1
  }
  router.push({ path: '/messageIndex', query: { tabIndex } })
}
// 退出登录
function toLogin() {
  loginStore.loginOut()
  disconnect()
}
// 钩子函数
onMounted(() => {
  initWebSocket()
})
</script>

<style scoped lang="scss">
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(156, 172, 209, 0.3);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;

  .logo {
    height: 100%;
    display: flex;
    width: 202px;
    align-items: center;

    &:hover {
      background-color: white;
    }
  }

  .header-center {
    flex: 1;
    padding: 0;

    .module-list {
      display: flex;
      min-width: 300px;
      width: 368px;
      height: 20px;
      align-items: center;
      margin-left: 40px;

      .index {
        display: inline-block;
        margin-right: 20px;

        span:hover {
          color: #0175ff;
        }

        .active {
          color: #0175ff;
        }
      }

      span {
        cursor: pointer;
        padding: 0 10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4d4e54;
        letter-spacing: 0;
      }
    }
  }

  .content-middle {
    width: 380px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search {
      width: 220px;
      border: 1px solid #ccc;
      border-radius: 30px;
      padding: 0 18px;
      height: 32px;
      background-color: #fff;
      display: flex;
      align-items: center;
      &.hidden {
        visibility: hidden;
      }

      input {
        border: none;
        outline: none;

        &::placeholder {
          color: #999;
        }
      }

      img {
        cursor: pointer;
      }
    }

    .el-button {
      display: flex;
      cursor: pointer;
      width: 60px;
      height: 32px;
      border-color: #0175ff;
      border-radius: 2px;

      &:hover {
        opacity: 0.85;
      }
    }

    .creation-btn {
      background: #0175ff;
    }

    .ask {
      margin-left: 10px;
      background-color: white;
      color: #0175ff;
    }
  }
}

.creation-list {
  width: 88px;
  height: 129px;
  padding: 0;
  background: #fff;

  :deep(.el-dropdown-menu__item) {
    width: 56px;
    line-height: 20px;
    padding: 16px 0 0;
    margin: 0 auto 0;
    justify-content: center;

    &.border-top {
      padding-top: 12px;
      margin-top: 12px;
      margin-bottom: 12px;
      border-top: 1px solid #e3e3ed;
      color: #0175ff;
    }

    &:hover {
      color: #0175ff;
      opacity: 0.85;
      background: transparent;
    }
  }
}

.notice {
  position: relative;
  margin: 0 34px;

  .notice__icon {
    img {
      cursor: pointer;
    }

    span {
      color: #f56b89;
      position: absolute;
      top: -5px;
    }
  }
}

.notice__item {
  position: relative;

  span {
    position: absolute;
    top: -1px;
    left: 30px;
    color: #f56b89;
  }
}

.person {
  .avatar__image {
    width: 46px;
    height: 46px;
    border-radius: 46px;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #d5d8e4;
  }
}

.dropdown-span {
  display: inline-block;
  width: 100px;
  text-align: center;
  list-style: none;
  color: #0175ff;
}

.is-dot {
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  width: 6px;
  height: 6px;
  background-color: #f56b89;
}
</style>
