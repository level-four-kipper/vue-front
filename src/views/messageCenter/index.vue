<template>
  <!-- 消息中心 -->
  <!-- <AuthorHeader /> -->
  <div class="content">
    <!-- 侧边菜单 -->
    <ul class="aside">
      <li v-for="(item, idx) in menuList" :key="idx" :class="{ 'is-active': currentIndex == idx + 1 }" @click="viewTargetInfo(idx + 1)">{{ item }}</li>
    </ul>
    <!-- 右侧展示 -->
    <div class="main">
      <div class="main__header">
        <span class="total_message">全部消息</span>
        <span class="total_clear" @click="handleDelAll">一键清除</span>
      </div>
      <!-- 列表 -->
      <div v-if="list.length" v-loading="loading" class="main__list">
        <div v-for="(item, idx) in list" :key="idx" class="list__item">
          <div class="item__header">
            <div class="header__left">
              <ComUser :user-id="item.sender_id" />
            </div>
            <div class="header__right">
              <span>{{ formatTime(item.gmt_created) }}</span>
              <img src="@/assets/img/answerPhoto/删除.png" @click="handleDel(item.id)" />
            </div>
          </div>
          <div class="item__content">
            <!-- 点赞 -->
            <template v-if="[1].includes(currentIndex)">
              <img src="@/assets/img/approvaled.png" />
              <span>{{ subType[currentIndex][item.sub_type] }}</span>
            </template>
            <!-- 评论 -->
            <template v-if="[2].includes(currentIndex)">
              <img src="@/assets/img/commenting.png" />
              <span>{{ subType[currentIndex][item.sub_type] }}</span>
            </template>
            <!-- 收藏 -->
            <template v-if="[3].includes(currentIndex)">
              <img src="@/assets/img/collected.png" />
              <span>{{ subType[currentIndex][item.sub_type] }}</span>
            </template>
            <!-- 评论 -->
            <template v-if="[4].includes(currentIndex)">
              <span>关注了你</span>
            </template>
            <!-- @我 -->
            <template v-if="[5].includes(currentIndex)">
              <span>{{ subType[currentIndex][item.sub_type] }}</span>
            </template>
            <!-- 系统 -->
            <template v-if="[6].includes(currentIndex)">
              <span>{{ subType[currentIndex][item.sub_type] }}</span>
            </template>
          </div>
          <!-- 关注 无需展示 -->
          <div v-if="currentIndex !== 4" class="item__footer" @click="toTargetPage(item.sub_type, item.product_id)">
            <!-- <img v-if="item.sub_type == 1" src="@/assets/img/authorPhoto/博客.png" class="foot_photo" /> -->
            <span>{{ item.product_title || '--' }}</span>
          </div>
        </div>
      </div>
      <!-- 加载更多 -->
      <div class="bottom-load">
        <el-icon v-if="loading">
          <Loading />
        </el-icon>
        <span v-else :class="{ more: loadStatus === 2 }" @click="loadMore">{{ loadMap[loadStatus - 1] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="messageCenter">
// import AuthorHeader from '@/views/personalCenter/components/AuthorHeader.vue'
import ComUser from '@/components/ComUser.vue'
import { fetchMessageList, fetchDeleteMessage, fetchDeleteAll } from '@/api/messageCenter.js'
import { ElMessageBox, ElMessage } from 'element-plus'

// 后端返回的子类汇总 ['博客', '问题', '回答', '评论', '评论回复', '题目', '题库', '关注', '授权题库角色', '撤销授权题库角色', '账户异地登录', '修改密码成功', '验证码']
// 前端需重新调整大类和子类的映射关系
const subType = {
  1: { 1: '点赞博客', 2: '点赞问题', 3: '点赞回答', 4: '点赞评论', 5: '点赞评论回复' }, // 点赞
  2: { 1: '评论博客', 2: '回答问题', 3: '评论回答', 5: '评论回复', 6: '评论题目' }, // 评论
  3: { 1: '收藏博客', 2: '关注问题', 3: '收藏问题回答', 7: '收藏题库' }, // 收藏
  4: { 8: '关注粉丝' }, // 关注
  5: { 9: '授权题库角色', 10: '撤销授权题库角色' }, // @我
  6: { 11: '账户异地登录', 12: '修改密码成功', 13: '邮箱验证码' } // 系统
}

const route = useRoute()
const router = useRouter()

const menuList = ['点赞', '评论', '收藏', '关注', '@我', '系统']
const currentIndex = ref(Number(route?.query?.tabIndex) || 1)

const loading = ref(false)
const list = ref([])
const total = ref(0)
const initPage = {
  pageIndex: 1,
  pageSize: 10,
  totalPage: 1
}
const page = ref({ ...initPage })
const loadStatus = ref(0)
const loadMap = ['暂无数据', '查看更多消息 >', '没有更多了']
const viewTargetInfo = val => {
  router.push({ path: '/messageIndex', query: { tabIndex: val } })
}

const formatTime = time => {
  const currentDate = new Date().getDate()
  const targetDate = new Date(time).getDate()
  return currentDate == targetDate ? `${new Date(time).getHours()}:${new Date(time).getMinutes()}` : time
}

// 列表
const getList = () => {
  const params = {
    page_size: page.value.pageSize,
    curr_page: page.value.pageIndex,
    entity: { type: currentIndex.value }
  }
  loading.value = true
  fetchMessageList(params)
    .then(res => {
      loading.value = false
      const { code, msg, data } = res
      if (code === 0 && data) {
        page.value.pageIndex = data?.curr_page || 1
        page.value.pageSize = data?.page_size || 10
        page.totalPage = data?.total_page || 1
        total.value = data?.total_count || 0
        list.value = [...list.value, ...(data?.list || [])]
        list.value.forEach(item => {
          item.isMore = false
        })
        handleFinish(data.curr_page, data.total_page, list.value)
      } else {
        console.log('res', msg)
      }
    })
    .catch(err => {
      loading.value = false
      console.log('err', err)
    })
}
// 加载完成
const handleFinish = (currPage, totalPage, arr) => {
  if (arr.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (currPage < totalPage) {
    // 加载更多
    loadStatus.value = 2
  } else if (currPage === totalPage) {
    // 没有更多了
    loadStatus.value = 3
  }
}
// 加载更多
const loadMore = () => {
  if (loadStatus.value !== 2) return
  page.value.pageIndex++
  getList()
}
// 删除
const handleDel = id => {
  ElMessageBox.confirm('确认删除当前数据吗？', '', {
    title: '提示',
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        try {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '处理中...'
          loading.value = true
          const res = await fetchDeleteMessage(id)
          if (res.code == 0) {
            getList()
            ElMessage.success('删除成功')
          } else {
            ElMessage.error(res?.msg || '删除失败')
          }
          instance.confirmButtonLoading = false
          instance.confirmButtonText = '确定'
          done()
        } catch (err) {
          instance.confirmButtonLoading = false
          instance.confirmButtonText = '确定'
          done()
          console.log('del-err', err)
        }
      } else {
        done()
      }
    }
  }).then(() => {
    loading.value = false
  })
}
// 一键清除
const handleDelAll = () => {
  if (!list.value.length) {
    ElMessage.error('当前暂无数据')
    return
  }
  ElMessageBox.confirm('确认要进行一键清除吗？', '', {
    title: '提示',
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        try {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '处理中...'
          loading.value = true
          const res = await fetchDeleteAll(currentIndex.value)
          if (res.code == 0) {
            getList()
            ElMessage.success('一键清除成功')
          } else {
            ElMessage.error(res?.msg || '一键清除失败')
          }
          instance.confirmButtonLoading = false
          instance.confirmButtonText = '确定'
          done()
        } catch (err) {
          instance.confirmButtonLoading = false
          instance.confirmButtonText = '确定'
          done()
          console.log('del-err', err)
        }
      } else {
        done()
      }
    }
  }).then(() => {
    loading.value = false
  })
}
// 跳转到指定页面
const toTargetPage = (sub_type, product_id) => {
  // 关注 无需跳转
  if (currentIndex == 4) return
  // 博客
  if ([1].includes(sub_type)) {
    router.push({ path: `/blogDetail/${product_id}` })
  }
  // 问题 回答
  if ([2, 3].includes(sub_type)) {
    router.push({ path: `/questionAnswerDetail/${product_id}` })
  }
  // 题库 授权题库角色 撤销授权题库角色
  if ([7, 9, 10].includes(sub_type)) {
    router.push({ path: `/questionBank/detail`, query: { id: product_id } })
  }
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.content {
  min-height: calc(100vh - 317px);
  background-color: #f5f8fe;
  margin: auto;
  padding: 30px 0;
  display: flex;
  justify-content: center;

  .aside {
    border-radius: 4px;
    background-color: #fff;
    width: 260px;
    height: 392px;
    padding: 30px 0;

    li {
      list-style: none;
      width: 100%;
      padding: 0 37px;
      margin-bottom: 42px;
      line-height: 20px;
      border-left: 3px solid #fff;

      &:hover {
        font-weight: 600;
        color: #0175ff;
        cursor: pointer;
      }
    }

    .is-active {
      font-weight: 600;
      color: #0175ff;
      border-left: 3px solid #0175ff;
    }
  }

  .main {
    width: calc(1200px - 260px - 30px);
    min-height: 384px;
    margin-left: 30px;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      > span {
        font-size: 14px;
        line-height: 20px;
      }

      .total_message {
        color: #333333;
      }

      .total_clear {
        cursor: pointer;
        color: #0175ff;
      }
    }

    &__list {
      background-color: #fff;
      padding: 20px;
      border-radius: 4px;

      .list__item:not(:last-child) {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #c8c8db;
      }

      .list__item {
        .item__header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .header__right {
            span {
              color: #9196a6;
            }

            img {
              cursor: pointer;
              margin-left: 20px;
              vertical-align: text-top;
            }
          }
        }

        .item__content {
          margin: 10px 0 10px 45px;
          color: #6d717d;

          img {
            margin-right: 10px;
            vertical-align: text-top;
          }
        }

        .item__footer {
          margin-left: 45px;
          padding: 11px;
          background: #eef3fd;
          border-radius: 4px;
          display: flex;
          align-items: center;
          color: #6d717d;

          img {
            margin-right: 12px;
          }

          span {
            display: inline-block;
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .bottom-load {
    margin-top: 30px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;

    span {
      color: #6d717d;

      &.more {
        color: #0175ff;

        &:hover {
          cursor: pointer;
          opacity: 0.85;
        }
      }
    }
  }
}
</style>
