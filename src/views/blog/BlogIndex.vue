<template>
  <!-- banner -->
  <div class="blog-banner">
    <div class="blog-banner_desc">
      <h3>博客</h3>
      <p>汇聚海量开发者经验</p>
    </div>
  </div>
  <!-- 面包屑 -->
  <Breadcrumb :list="[{ name: '博客', path: '' }]" />
  <AreaHeader @handleAreaChange="handleAreaChange" />
  <!-- main -->
  <div class="blog-main">
    <div class="blog-content">
      <div class="blog-content__left">
        <!-- 博客列表 -->
        <!-- <BlogTabs :list="tagList" /> -->
        <BlogList :tag="active" />
      </div>
      <div class="blog-content__right">
        <div class="blog-btn">
          <div @click="jumpPage(`/publishBlog`)">
            <img src="@/assets/img/blog-index/writeblog-icon.png" />
            <p>写博客</p>
          </div>
          <div @click="jumpPage(`/personalIndex`)">
            <img src="@/assets/img/blog-index/myblog-icon.png" />
            <p>我的博客</p>
          </div>
        </div>
        <!-- 精选专栏 -->
        <!-- <BlogSelected /> -->
        <!-- 最热博客 -->
        <BlogHot />
      </div>
    </div>
  </div>
  <!-- 回到顶部 -->
  <el-backtop class="bar-backtop" :bottom="294" :right="40">
    <img src="@/assets/img/blog-index/backtop-btn.png" />
  </el-backtop>
</template>

<script setup name="blogIndex">
import Breadcrumb from '@/components/Breadcrumb.vue'
import AreaHeader from '@/components/AreaHeader.vue'
import BlogHot from './components/BlogHot.vue'
import BlogList from './components/BlogList.vue'

const router = useRouter()
const jumpPage = path => {
  router.push({ path })
}

const active = ref('')

const handleAreaChange = area_id => {
  console.log(area_id)
  active.value = area_id + ''
}
</script>

<style lang="scss" scoped>
.blog-banner {
  position: relative;
  min-width: 1200px;
  height: 200px;
  background: url('@/assets/img/blog-index/blog-banner.png') no-repeat center;
  background-size: cover;
  color: #333;
  &_desc {
    top: 50%;
    transform: translateY(-50%);
    width: 1200px;
    margin: 0 auto;
    h3 {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 16px;
      line-height: 42px;
    }
    p {
      font-size: 20px;
      line-height: 28px;
    }
  }
}
.blog-main {
  width: 1200px;
  // position: absolute;
  margin: 20px auto;
  .blog-content {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    &__left {
      width: 780px;
    }
    &__right {
      width: 360px;
      .blog-btn {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        div {
          width: 170px;
          height: 83px;
          line-height: 0;
          text-align: center;
          background: #ffffff;
          box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
          border-radius: 4px;
          &:hover {
            cursor: pointer;
            opacity: 0.85;
          }
          img {
            width: 34px;
            height: 30px;
            margin: 16px 0 5px;
          }
          p {
            font-size: 14px;
            line-height: 20px;
            color: #333;
          }
        }
      }
    }
  }
}
.bar-backtop {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  box-shadow: none;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
</style>
