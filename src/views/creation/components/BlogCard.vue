<template>
  <!-- <TabHeader :tabLabel="tabLabel" :totalCount="totalCount" :page="page" :menuIndex="menuIndex" @handlePageChange="handlePageChange" /> -->
  <!-- <div class="blog-list"> -->
  <div class="blog-card">
    <div class="blog-item">
      <div class="blog-img" @click="jumpBlogDetail(blog.id)">
        <el-image :src="blog.image" fit="contain">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture />
              </el-icon>
              <div>暂无图片</div>
            </div>
          </template>
        </el-image>
        <img class="type-image" src="@/assets/img/creation/transshipment.png" alt="转载" v-if="blog.creation_type === 1" />
        <img class="type-image" src="@/assets/img/creation/original.png" alt="原创" v-else />
        <span v-if="route.path.includes('myCollect')" class="right-flag" @click.stop="handleChangeStar(blog.id)">
          <img v-if="tabLabel" src="@/assets/img/collected.png" alt="已收藏" />
        </span>
      </div>

      <div class="blog-title" @click="jumpBlogDetail(blog.id)">{{ blog.title }}</div>
      <div class="blog-time">{{ blog.create_day }}</div>
      <div v-show="showCount" class="blog-btns">
        <div>
          <img src="@/assets/img/view.png" alt="浏览" />
          <span>{{ blog.browse_count }}</span>
        </div>
        <div>
          <img src="@/assets/img/comment.png" alt="评论" />
          <span>{{ blog.comment_count }}</span>
        </div>
        <div>
          <!-- <img v-if="blog.like_flag" src="@/assets/img/approvaled.png" alt="已点赞" /> -->
          <img src="@/assets/img/approval.png" alt="点赞" />
          <span>{{ blog.like_count }}</span>
        </div>
        <div>
          <!-- <img v-if="blog.star_count > 0" src="@/assets/img/collected.png" alt="已收藏" /> -->
          <img src="@/assets/img/collect.png" alt="收藏" />
          <span>{{ blog.star_count }}</span>
        </div>
      </div>
    </div>
    <!--  个人视角可编辑 -->
    <div v-if="!route.params.id && menuIndex === 0" class="blog-edit">
      <span @click.stop="jumpEdit(blog)" class="edit-content">
        <img src="@/assets/img/personalCenter/edit.png" />
        <img src="@/assets/img/personalCenter/edit-active.png" />
        <span>编辑</span>
      </span>

      <el-dropdown @command="handleDelete(blog)">
        <span class="more-content" @mouseenter="showMore = true" @mouseleave="showMore = false">
          <img v-show="!showMore" src="@/assets/img/personalCenter/more.png" class="more" />
          <img v-show="showMore" src="@/assets/img/personalCenter/more-active.png" class="more" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- </div> -->
</template>

<script setup>
// import TabHeader from './TabHeader.vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useLoginStore } from '@/stores/login.js'

const props = defineProps({
  blog: {
    type: Object,
    default: () => {},
  },
  tabLabel: String,
  menuIndex: Number,
  showCount: {
    type: Boolean,
    default: true,
  },
})
// const { searchValue } = inject('searchValue')
const emit = defineEmits(['handleAction', 'delete'])
const loginStore = useLoginStore()
const { id } = storeToRefs(loginStore)
const route = useRoute()
const isMore = ref(false)
const userId = computed(() => {
  return route.params.id || id.value
})
const router = useRouter()
const showMore = ref(false)
const clickMore = () => {}
// 删除博客
const handleDelete = item => {
  emit('delete', item)
}

// 跳转博客编辑
const jumpEdit = blog => {
  const routeUrl = router.resolve({
    path: `/publishBlog`,
    query: { id: blog.id },
  })
  window.open(routeUrl.href, '_blank')
}

// 跳转博客详情
const jumpBlogDetail = id => {
  const routeUrl = router.resolve({
    path: `/blogDetail/${id}`,
  })
  window.open(routeUrl.href, '_blank')
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.blog-card {
  width: 290px;
  border-radius: 4px;
  margin: 0 20px 20px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &:hover {
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
  .blog-item {
    background: #fff;
    padding: 10px;
    padding-bottom: 14px;
    height: 314px;

    .blog-img {
      padding: 0;
      .type-image {
        left: 0px;
        position: absolute;
      }
      .el-image {
        width: 270px;
        height: 168px;
        cursor: pointer;
        img {
          border-radius: 4px;
        }
      }
      .right-flag {
        position: absolute;
        right: 0;
        top: 0;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover::after {
          z-index: 999;
          content: '取消收藏';
          display: inline-block;
          position: absolute;
          left: 42px;
          width: 62px;
          height: 22px;
          background-color: rgba(0, 0, 0);
          opacity: 0.2;
          border-radius: 2px;
          font-weight: 400px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          line-height: 22px;
        }
      }
    }
    & > div {
      padding: 0 5px;
    }
    .blog-title {
      cursor: pointer;
      height: 44px;
      line-height: 22px;
      font-size: 16px;
      color: #333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .blog-time {
      margin-top: 10px;
      line-height: 20px;
      font-size: 14px;
      color: #9196a6;
    }
    .blog-btns {
      display: flex;
      align-items: center;
      margin-top: 20px;

      & > div {
        display: flex;
        align-items: center;
        margin-right: 21px;

        span {
          line-height: 20px;
          margin-left: 2px;
          font-size: 14px;
          color: #9196a6;
        }
      }
    }
  }
  .blog-edit {
    margin-top: 1px;
    background: #fff;
    padding: 0 10px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    .edit-content {
      margin-right: 16px;
      img:nth-child(2) {
        display: none;
      }
      &:hover {
        img:nth-child(1) {
          display: none;
        }
        img:nth-child(2) {
          display: inline-block;
        }
        span {
          color: #0175ff;
          opacity: 0.85;
        }
      }
    }
    img {
      cursor: pointer;
    }
    & > span {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    & > span:hover {
      color: #0175ff;
    }
    .btn-delete {
      position: absolute;
      top: 30px;
      right: -8px;
      background: #ffffff;
      border: none;
      color: #333;
      box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
    }
  }
}

.image-slot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  .el-icon {
    font-size: 28px;
  }
  div {
    font-size: 14px;
  }
}
</style>
