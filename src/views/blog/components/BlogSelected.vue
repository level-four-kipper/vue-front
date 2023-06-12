<template>
  <div class="blog-selected">
    <div class="blog-selected-name">精选专栏</div>
    <img class="blog-selected-cover" src="@/assets/img/blog-index/selected-icon.png" @click="jumpPage(`/blogDetail/1`)" />
    <div class="blog-selected-title text-overflow" @click="jumpPage(`/blogDetail/1`)">Python是人工智能开发的主流语言吗？</div>
    <div class="blog-selected-desc text-overflow" @click="jumpPage(`/blogDetail/1`)">Python已经是人工智能第一语言这个是事实，大厂出Python已经是人工智能第一语言这个是事实，大厂出的…</div>
  </div>
</template>

<script setup name="blogSelected">
import useBlog from '@/hooks/useBlog.js'

const { jumpPage } = useBlog()
</script>

<style lang="scss" scoped>
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.blog-selected {
  margin-bottom: 60px;
  &-name {
    line-height: 25px;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  &-cover {
    width: 360px;
    height: 220px;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  &-title {
    line-height: 22px;
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
      text-decoration: underline;
    }
  }
  &-desc {
    line-height: 20px;
    font-size: 14px;
    color: #6d717d;
  }
}
</style>
