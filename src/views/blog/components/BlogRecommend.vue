<template>
  <div class="recommend" v-if="list.length">
    <div class="recommend-head">
      <div class="recommend-head-name">相关推荐</div>
      <div class="recommend-change-btn hover">
        <span>换一批</span>
        <el-icon size="12" color="#9196A6">
          <Refresh />
        </el-icon>
      </div>
    </div>
    <div class="recommend-main">
      <div class="recommend-blog" v-for="item in list" :key="item.id" @click="jumpPage(`/blogDetail/${item.id}`)">
        <el-image class="recommend-blog-cover" :src="item.image"></el-image>
        <div class="recommend-blog-title text-overflow">{{item.title}}</div>
        <div class="recommend-blog-info">
          <div class="recommend-blog-info-user">
            <el-image src=""></el-image>
            <span>Da Shuju</span>
          </div>
          <div class="recommend-blog-info-view">
            <img src="@/assets/img/blog-index/view.png" />
            <span>852</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="BlogRecommend">
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const jumpPage = path => {
  router.push({
    path
  })
}
</script>

<style lang="scss" scoped>
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
.recommend {
  width: 1440px;
  margin: 60px auto 0;
  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 19px;
    &-name {
      line-height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .recommend-change-btn {
      display: flex;
      align-items: center;
      span {
        line-height: 20px;
        margin-right: 7px;
        font-size: 14px;
        color: #9196a6;
        user-select: none;
      }
    }
  }
  &-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .recommend-blog {
      &:hover {
        cursor: pointer;
      }
      &-cover {
        width: 337px;
        height: 208px;
        margin-bottom: 10px;
        border-radius: 4px;
      }
      &-title {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 16px;
        color: #333;
      }
      &-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        div {
          display: flex;
          align-items: center;
          span {
            line-height: 20px;
            font-size: 14px;
            color: #333;
          }
        }
        &-user {
          .el-image {
            width: 32px;
            height: 32px;
            margin-right: 6px;
            border-radius: 32px;
          }
        }
        &-view {
          img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
          }
          span {
            color: #9196a6 !important;
          }
        }
      }
    }
  }
}
</style>
