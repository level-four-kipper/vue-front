<template>
  <div class="blog">
    <!-- 面包屑 -->
    <div class="blog-breadcrumb">
      <Breadcrumb :list="[{name: '博客',path: '/blogIndex'},{name: '博客详情',path: ''}]" />
    </div>
    <div class="blog-top" v-if="data">
      <!-- 博客标题 -->
      <BlogTitle :article="data.article" />
    </div>
    <div :class="{'blog-main': true, 'no-titles': !hasTitles}" v-if="data">
      <div class="blog-main__center">
        <!-- 博客正文 -->
        <BlogArticle
          :article="data.article"
          @handleStar="handleStarClick"
          @handleLike="handleLikeClick"
        />
      </div>
      <div class="blog-main__right">
        <!-- 博主信息 -->
        <BlogAuthor :author="data.article.author_info" />
      </div>
    </div>
    <div v-if="!isPreview" :class="{'blog-foot': true, 'no-titles': !hasTitles}" ref="footRef">
      <div>
        <!-- 评论 -->
        <BlogComment
          ref="commentRef"
          :id="id"
          :userId="data.article?.author_info?.id"
          @updateComment="updateComment"
        />
      </div>
      <!-- 相关推荐 -->
      <!-- <BlogRecommend :list="data?.recommend_article" /> -->
    </div>
    <!-- 工具栏 -->
    <BlogDetailBar
      :hasTitles="hasTitles"
      :article="data.article"
      @handleStar="handleStarClick"
      @handleLike="handleLikeClick"
      @handleComment="handleCommentClick"
    />
  </div>
</template>

<script setup name="BlogDetail">
import Breadcrumb from '@/components/Breadcrumb.vue'
import BlogTitle from './components/BlogTitle.vue'
// import BlogCatalog from './components/BlogCatalog.vue'
import BlogAuthor from './components/BlogAuthor.vue'
import BlogArticle from './components/BlogArticle.vue'
import BlogComment from './components/BlogComment.vue'
// import BlogRecommend from './components/BlogRecommend.vue'
import BlogDetailBar from './components/BlogDetailBar.vue'
import { ElMessage } from 'element-plus'

import useBlog from '@/hooks/useBlog.js'

const route = useRoute()

const id = ref('')
const data = reactive({
  article: {}
})
const footRef = ref(null)
const commentRef = ref(null)
const isPreview = computed(() => {
  return route.query.preview
})

const { getBlogDetail, handleLike, handleCollect } = useBlog()

const hasTitles = ref(true)

// 获取博客信息
const handleGetBlog = () => {
  getBlogDetail(id.value).then(res => {
    data.article = res
  })
}

// 点赞
const handleLikeClick = () => {
  handleLike(id.value)
    .then(() => {
      handleGetBlog()
    })
    .catch(() => {
      ElMessage({
        message: '操作失败',
        type: 'warning'
      })
    })
}

// 收藏
const handleStarClick = () => {
  handleCollect(id.value)
    .then(() => {
      handleGetBlog()
    })
    .catch(() => {
      ElMessage({
        message: '操作失败',
        type: 'warning'
      })
    })
}

// 评论
const handleCommentClick = () => {
  nextTick(() => {
    // 滚动到评论区
    footRef.value.scrollIntoView({
      behavior: 'smooth'
    })
    // focus
    setTimeout(() => {
      commentRef.value.focusInput()
    }, 500)
  })
}

// 更新文章标题里的评论数量
const updateComment = count => {
  data.article.comment_count = count
}

watch(
  () => route.params.id,
  (newVal, oldVal) => {
    // console.log('路由切换')
    // 避免重复请求
    if (!oldVal) {
      id.value = newVal
      handleGetBlog(newVal)
    }
  },
  {
    immediate: true
  }
)

provide('hasTitles', hasTitles)
</script>

<style lang="scss" scoped>
.blog-breadcrumb,
.blog-top,
.blog-main,
.blog-foot {
  min-width: 1200px;
  margin: 0 auto;
}
.blog-breadcrumb,
.blog-main {
  max-width: 1440px;
}
.blog-top {
  position: relative;
  min-height: 147px;
  padding: 40px 0 30px;
  &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    content: '';
    opacity: 0.5;
    background: #c8c8db;
  }
}
.blog-main {
  min-height: 540px;
  padding: 40px 0;
  display: flex;
  max-width: 1440px;
  justify-content: center;
  &.no-titles {
    max-width: 1200px;
    .blog-main__center {
      margin-right: 150px;
    }
  }
  &__center {
    flex: 1;
    margin: 0 59px 0 0;
  }
  &__right {
    width: 270px;
  }
}
.blog-foot {
  padding: 40px 0 60px;
  background: #eef3fd;
  & > div {
    display: flex;
    justify-content: center;
  }
  &.no-titles {
    & > div {
      max-width: 1200px;
      margin: 0 auto;
      justify-content: flex-start;
    }
  }
}
</style>
