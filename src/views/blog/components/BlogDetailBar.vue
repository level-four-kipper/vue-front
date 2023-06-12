<template>
  <div :class="{'bar': true, 'show-bar': showBar}" id="barRef">
    <template v-if="!isPreview">
      <div
        :class="['bar-collect', {hover: article?.star_flag || false}]"
        @click="emit('handleStar')"
      ></div>
      <div :class="['bar-like', {hover: article?.like_flag || false}]" @click="emit('handleLike')"></div>
      <div
        class="bar-comment"
        @click="emit('handleComment')"
        @mouseover="showPopover = true"
        @mouseleave="showPopover = false"
      >
        <div class="popover" v-if="showPopover">发表评论</div>
      </div>
    </template>
    <el-backtop class="bar-backtop" :bottom="293" :right="40">
      <img src="@/assets/img/blog-index/backtop-btn.png" />
    </el-backtop>
  </div>
</template>

<script setup name="BlogDetailBar">
const props = defineProps({
  hasTitles: {
    // 是否有目录，没目录按钮在左边，有目录按钮在右边
    type: Boolean,
    default: true
  },
  article: {
    type: Object,
    default: () => {}
  }
})

const route = useRoute()
const isPreview = computed(() => {
  return route.query.preview
})

const emit = defineEmits(['handleLike', 'handleStar', 'handleComment'])
// 评论提示框展示
const showPopover = ref(false)

// 动态设置工具栏位置
const showBar = ref(false)
const setBarLocation = () => {
  if (window.scrollY >= 400) {
    showBar.value = true
  } else {
    showBar.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    setBarLocation()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', setBarLocation())
})
</script>

<style lang="scss" scoped>
.bar {
  position: fixed;
  right: 40px;
  bottom: 343px;
  width: 50px;
  z-index: -1;
  opacity: 0;
  transition: all 0.3s;
  &.show-bar {
    z-index: 100;
    opacity: 1;
  }
  .bar-collect,
  .bar-like,
  .bar-comment,
  .bar-backtop {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
    border-radius: 50px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: none;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  }
  .bar-backtop {
    margin-bottom: 0;
    overflow: hidden;
  }
  &-collect {
    background-image: url(@/assets/img/blog-index/collect-btn.png);
    &.hover {
      background-image: url(@/assets/img/blog-index/collect-btn-hover.png);
    }
  }
  &-like {
    background-image: url(@/assets/img/blog-index/like-btn.png);
    &.hover {
      background-image: url(@/assets/img/blog-index/like-btn-hover.png);
    }
  }
  .bar-comment {
    position: relative;
    background-image: url(@/assets/img/blog-index/comment-btn.png);
    &.hover {
      background-image: url(@/assets/img/blog-index/comment-btn-hover.png);
    }
    .popover {
      position: absolute;
      right: 65px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 50px;
      font-size: 14px;
      color: #333;
      border: none;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
      &::after {
        position: absolute;
        content: '';
        top: 50%;
        right: -9px;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border: 5px solid;
        border-left-color: #fff;
        border-right-color: transparent;
        border-top-color: transparent;
        border-bottom-color: transparent;
        box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
      }
    }
  }
}
</style>
