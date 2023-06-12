<template>
  <div class="blog">
    <div class="blog-left" v-if="titles.length">
      <div class="blog-catalog">
        <div class="blog-catalog__name">文章目录</div>
        <el-scrollbar class="scroll-box">
          <div
            class="blog-catalog__title"
            v-for="(anchor, index) in titles"
            :key="index"
            :style="{ 'padding-left': `${anchor.indent * 20}px` }"
          >
            <span
              :class="{active: titlesActiveIndex === index}"
              @click="handleAnchorClick(anchor, index)"
            >{{ anchor.title }}</span>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div :class="{'blog-content': true, 'no-titles': !hasTitles}">
      <!-- 博文内容 -->
      <VMdPreview :text="article.content_md || article.content" ref="previewRef" />
      <!-- 点赞收藏 -->
      <div class="btn-area" v-if="!isPreview">
        <div class="hover-btn" @click="emit('handleLike')">
          <img :src="article.like_flag ? BlogIndexLikeIconHover : BlogIndexLikeIcon" />
          <span>点赞</span>
          <span>{{article.like_count}}</span>
        </div>
        <div class="hover-btn" @click="emit('handleStar')">
          <img :src="article.star_flag ? BlogIndexCollectIconHover : BlogIndexCollectIcon" />
          <span>收藏</span>
          <span>{{article.star_count}}</span>
        </div>
      </div>
      <!-- 博文标签 -->
      <div class="article-tag">
        <span v-for="item in article.tag_list" :key="item.id">#{{item}}#</span>
      </div>
    </div>
  </div>
</template>

<script setup name="BlogArticle">
import VMdPreview from '@/components/VMdPreview.vue'

import { throttle } from '@/utils/utils.js'

const props = defineProps({
  article: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['handleLike', 'handleStar'])
const hasTitles = inject('hasTitles')

const previewRef = ref(null)
const titles = ref([])
const titlesActiveIndex = ref(0)
const route = useRoute()
const isPreview = computed(() => {
  return route.query.preview
})

// 获取锚点数组
const getTitle = () => {
  nextTick(() => {
    // 获取h标签
    const anchors = previewRef.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6')
    // 删除标题头尾空格
    const titlesList = Array.from(anchors).filter(title => !!title.innerText.trim())

    if (!titlesList.length) {
      titles.value = []
      return
    }

    // 从h标签属性中，提取信息
    const hTags = Array.from(new Set(titlesList.map(title => title.tagName))).sort()
    titles.value = titlesList.map(el => ({
      title: el.innerText, // 标题内容
      lineIndex: el.getAttribute('data-v-md-line'), // 标签line id
      indent: hTags.indexOf(el.tagName), // 标签层级
      height: el.offsetTop // 标签距离页面顶部距离
    }))
  })
}

// 目录点击
const handleAnchorClick = (anchor, index) => {
  nextTick(() => {
    const { lineIndex } = anchor
    // 查找lineIndex对应的元素对象
    const heading = previewRef.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)

    // 目录跳转
    if (heading) {
      // 顶部距离得动态计算，否则内容加载未完成时计算不准
      window.scrollTo({ top: heading.offsetTop, behavior: 'smooth' })
    }

    // 修改当前高亮的标题
    titlesActiveIndex.value = index
  })
}

// 滚动切换目录
const handleScroll = () => {
  let scrollTop = document.documentElement.scrollTop
  titles.value.forEach((item, index) => {
    const { lineIndex } = item
    const heading = previewRef.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
    if (heading.offsetTop <= scrollTop) {
      titlesActiveIndex.value = index
    }
  })
}

watch(
  () => props.article,
  () => {
    getTitle()
  }
)

watch(
  () => titles.value,
  () => {
    hasTitles.value = titles.value.length ? true : false
  }
)

// 监听页面滚动
window.addEventListener('scroll', throttle(handleScroll, 100))

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.hover-btn {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}

.blog {
  display: flex;
  // 目录导航
  .blog-left {
    width: 210px;
    .blog-catalog {
      position: sticky;
      top: 104px;
      width: 210px;
      z-index: 100;
      transition: all 0.3s;
      &__name {
        line-height: 25px;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
      .scroll-box {
        height: calc(100vh - 149px);
      }
      .blog-catalog__title {
        line-height: 20px;
        margin-bottom: 16px;
        font-size: 14px;
        color: #6d717d;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        span {
          user-select: none;
          &:hover,
          &.active {
            cursor: pointer;
            color: #0175ff;
          }
        }
      }
    }
  }

  .blog-content {
    flex: 1;
    max-width: 780px;
    min-width: 500px;
    margin-left: 121px;
    &.no-titles {
      margin-left: 0;
    }
    // 正文
    :deep(.v-md-editor-preview) {
      .github-markdown-body:not(.custom) {
        min-height: 256px;
        padding: 0;
        div[data-v-md-line='1'] {
          // 兼容存在table布局导致的异常
          table,
          tbody,
          tr,
          td {
            display: block;
          }
        }
      }
    }
  }
  .btn-area {
    display: flex;
    justify-content: center;
    margin: 60px auto 80px;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 64px;
      background-image: linear-gradient(270deg, #39decd 0%, #33e09f 100%);
      border-radius: 32px;
      &:first-child {
        margin-right: 60px;
      }
      img {
        width: 22px;
        height: 22px;
      }
      span {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        margin-left: 6px;
        color: #fff;
      }
    }
  }
  .article-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px 12px;
      height: 32px;
      margin: 0 10px 20px;
      background: #eef3fd;
      border-radius: 16px;
      font-size: 14px;
      color: #0175ff;
    }
  }
}
</style>
