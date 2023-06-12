<template>
  <div class="blog-list">
    <!-- 列表 -->
    <div class="blog-list__content">
      <div v-for="(item, index) in list" :key="index" class="blog-content">
        <div class="blog-content__left">
          <div class="title" @click="jumpPage(item)">
            <div class="title-content" v-html="item.title"></div>
            <div class="title-type">{{ contentType[item.type] }}</div>
          </div>
          <div class="content" @click="jumpPage(item)" v-html="item.content"></div>
          <div class="blog-tool">
            <!-- 浏览 -->
            <div class="hover">
              <img src="@/assets/img/blog-index/view.png" />
              <span>{{ item.browse_count }}</span>
            </div>
            <!-- 点赞 -->
            <div class="hover">
              <img v-if="item.like_flag" src="@/assets/img/blog-index/like-hover.png" />
              <img v-else src="@/assets/img/blog-index/like.png" />
              <span>{{ item.like_count }}</span>
            </div>
            <!-- 收藏 -->
            <!-- <div class="hover" @click="handleCollectAdd(item.id)">
            <img v-if="item.star_flag" src="@/assets/img/blog-index/star-hover.png" />
            <img v-else src="@/assets/img/blog-index/star.png" />
            <span>{{item.star_count}}</span>
          </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="BlogList">
import { htmlToString } from '@/utils/utils.js'
import ComUser from '@/components/ComUser.vue'
import VMdPreview from '@/components/VMdPreview.vue'
import useBlog from '@/hooks/useBlog.js'
import { useCommonStore } from '@/stores/common.js'
import { fetchSearchRecordAdd, fetchSearchContentAdd, fetchSearchKeyAdd } from '@/api/index.js'

const props = defineProps({
  tag: {
    // 博文分类
    type: String,
    default: '1'
  },
  list: { type: Array, default: [] },
  searchWord: { type: String, default: ' ' }
})

const blogStatus = ref(1)
const blogStatusOptions = reactive([
  // { label: '推荐', value: 0 },
  { label: '最新', value: 1 },
  { label: '最热', value: 2 }
])
const loading = ref(false)
const pageIndex = ref(1)
const pageSize = 10
const router = useRouter()
const loadStatus = ref(1)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})
const contentType = {
  blog: '博客',
  quiz: '问答',
  question: '题库'
}
const typeMap = {
  blog: 0,
  quiz: 1,
  question: 5
}

const commonStore = useCommonStore()
const searchWord = computed(() => {
  return props.searchWord
})
const { handleLike, handleCollect, getBlogDetail } = useBlog()
const emits = defineEmits(['handleUpdate'])

const jumpPage = item => {
  addSearchContent(item)
  let routeUrl = ''
  if (item.type === 'blog') {
    routeUrl = router.resolve({
      path: `/blogDetail/${item.id}`
    })
  } else if (item.type === 'quiz') {
    routeUrl = router.resolve({
      path: `/questionAnswerDetail/${item.id}`
    })
  } else if (item.type === 'question') {
    routeUrl = router.resolve({
      path: `/questionBank/detail`,
      query: { id: item.id }
    })
  }

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

//增加热搜内容
function addSearchContent(item) {
  const params = { id: item.id, title: item.title, type: typeMap[item.type] }
  fetchSearchContentAdd(params).then(res => {})
}
</script>

<style lang="scss" scoped>
.blog-list {
  &__top {
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
    margin-top: 25px;
    .left {
      font-size: 14px;
      line-height: 20px;
      span {
        margin: 0;
      }
    }
    span {
      font-size: 14px;
      margin-left: 20px;
      &:hover,
      &.is-active {
        cursor: pointer;
        color: #0175ff;
      }
    }
  }
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
    padding: 30px 0;
    border-bottom: 1px solid rgba(200, 200, 219, 0.5);
    color: #333;
    &__left {
      margin-right: 20px;
      .title {
        cursor: pointer;
        display: flex;
        align-items: center;
        .title-content {
          font-size: 18px;
          color: #333333;
          font-weight: 600;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          max-width: 680px;
        }
        .title-type {
          height: 24px;
          background: #eef3fd;
          border-radius: 2px;
          color: #6d717d;
          padding: 0 6px;
          margin-left: 10px;
        }
      }
      .content {
        margin-top: 6px;
        cursor: pointer;
        font-size: 14px;
        // line-height: 20px;
        color: #6d717d;
      }
      .blog-title {
        font-size: 18px;
        line-height: 25px;
        margin: 6px 0 10px;

        span {
          font-weight: 600;
          &:hover {
            text-decoration: underline;
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
        margin-top: 8px;
        display: flex;
        height: 32px;
        display: flex;
        align-items: center;
        cursor: default;
        div {
          display: flex;
          align-items: center;
          margin-right: 16px;
          font-size: 14px;
          color: #9196a6;
          img {
            width: 18px;
            height: 18px;
            margin-right: 2px;
            cursor: default;
          }
        }
      }
      :deep(.github-markdown-body) {
        padding: 0;
      }
    }
    &__right {
      width: 180px;
      line-height: 0;
      .el-image {
        width: 180px;
        height: 112px;
        border-radius: 4px;
      }
    }
  }
  .blog-load {
    margin: 30px 0 60px;
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
