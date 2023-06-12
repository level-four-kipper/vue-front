<template>
  <!-- 相关问题 -->
  <div class="relate-answer-title">相关问题</div>
  <div class="relate-top" v-for="question in relatedQuestions" :key="question?.id">
    <span class="hover" @click="jumpQuestionDetail(question?.id)">{{ question?.title }}</span>
    <span class="related-answer-desc">{{ question?.comment_count }}个回答</span>
  </div>

  <!-- 相关博文 -->
  <div class="related-blog-title">相关博文</div>
  <div class="related-blogs" v-for="blog in relatedBlogs" :key="blog?.id">
    <div class="related-blog-image" v-if="blog?.image">
      <el-image :src="blog?.image" fit="contain" alt="博文图片" />
    </div>
    <div class="related-blog-info">
      <div class="related-blog-name hover" @click="jumpBlogDetail(blog?.id)">{{ blog?.title }}</div>
      <div class="related-blog-desc">{{ blog?.content }}</div>
    </div>
  </div>
</template>

<script setup name="DetailRelate">
import { ref, onMounted } from 'vue'
import { getRelatedQuestion } from '@/api/answer.js'
import { fetchRecommendBlog } from '@/api/blog.js'
const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})
const router = useRouter()
const relatedQuestions = ref([])
const relatedBlogs = ref([])
const currentPage = ref(1)
const currentPageSize = ref(10)
// 请求关联问答
const queryRelatedQuestion = () => {
  const params = {
    list_tags: props?.tags
  }
  getRelatedQuestion(params)
    .then(res => {
      if (res.code === 0 && res?.data?.length) {
        relatedQuestions.value = res?.data?.slice(0, 5)
      }
    })
    .catch(err => console.log(err))
}

// 请求相关博文
// featchBlogList({
//     curr_page: pageIndex.value,
//     entity: tag === '' ? {} : { tag: Number(tag) },
//     page_size: pageSize
//   }).then(res => {
//     loading.value = false
//     if (res.code !== 0) {
//       return
//     }

//     handleFinish(res?.data?.curr_page || 1, res?.data?.total_page || 1, res?.data?.list || [])
//   })
const queryRelatedBlog = () => {
  const params = {
    curr_page: currentPage.value,
    page_size: currentPageSize.value
  }
  fetchRecommendBlog(params)
    .then(res => {
      if (res.code === 0 && res?.data?.list?.length) {
        relatedBlogs.value = res?.data?.list?.slice(0, 6)
      }
    })
    .catch(err => console.log(err))
}

const jumpQuestionDetail = id => {
  router.push(`/questionAnswerDetail/${id}`)
}

const jumpBlogDetail = id => {
  router.push(`/blogDetail/${id}`)
}
onMounted(async () => {
  queryRelatedQuestion()
  queryRelatedBlog()
})
</script>

<style lang="scss" scoped>
.relate-answer-title {
  color: #333333;
  font-size: 18px;
  font-weight: 800;
  margin-right: 10px;
}
.relate-top {
  margin-top: 20px;
  .hover {
    &:hover {
      cursor: pointer;
      color: #0175ff;
    }
  }
}
.related-answer-desc {
  color: #9196a6;
  margin-left: 10px;
}

.related-blog-title {
  color: #333333;
  margin-top: 60px;
  font-size: 18px;
  font-weight: 800;
}
.related-blogs {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  .related-blog-image {
    min-width: 120px;
    margin-right: 12px;
    .el-image {
      width: 120px;
      height: 74px;
      border-radius: 4px;
    }
  }
  .related-blog-info {
    max-width: 218px;
    min-height: 50px;
    .related-blog-name {
      line-height: 20px;
      margin-bottom: 5px;
      max-height: 40px;
      word-wrap: break-word;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow: hidden;
      &:hover {
        cursor: pointer;
        color: #0175ff;
      }
      display: -webkit-box;
    }
    .related-blog-desc {
      color: #6d717d;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      &:hover {
        cursor: pointer;
        color: #0175ff;
      }
    }
  }
}
</style>
