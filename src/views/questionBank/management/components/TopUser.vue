<template>
  <div>
    <div class="title">贡献榜</div>
    <div class="list">
      <div
        class="list__cell"
        v-for="item in list"
        :key="item.id"
        @click="jumpPage(`/authorIndex/${item.id}`)"
      >
        <img :src="item.img_url" alt />
        <div class="user-info">
          <div class="user-name">{{ item.name }}</div>
          <div class="user-desc">
            <span>博客：{{ item.blogs_count }}篇</span>
            <span>粉丝：{{ item.fans_count }}人</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="no-data" v-if="!list.length">暂无数据</div>
</template>

<script setup>
import useQuestionbank from '@/hooks/useQuestionbank'
import { fetchHotUsers } from '@/api/questionBank.js'

const router = useRouter()
const { bankId } = useQuestionbank()
const list = ref([])

const _fetchHotUsers = () => {
  fetchHotUsers(bankId.value).then(res => {
    list.value = res.data || []
  })
}

const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

onMounted(() => {
  _fetchHotUsers()
})
</script>

<style lang="scss" scoped>
.title {
  line-height: 22px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.list {
  &__cell {
    display: flex;
    align-items: center;
    margin-top: 20px;
    &:hover {
      .user-info .user-name {
        color: #0175ff;
      }
    }
    img {
      width: 54px;
      height: 54px;
      border-radius: 54px;
      margin-right: 10px;
      cursor: pointer;
    }
    .user-info {
      flex: 1;

      .user-name {
        line-height: 22px;
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
        cursor: pointer;
      }
      .user-desc {
        display: flex;
        align-items: center;
        line-height: 20px;
        font-size: 14px;
        color: #9196a6;
        span:first-child {
          margin-right: 18px;
        }
      }
    }
    .question-title {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }
    .test-number {
      color: #ccc;
    }
  }
}
.no-data {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #9196a6;
}
</style>
