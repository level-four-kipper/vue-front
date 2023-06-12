<template>
  <div class="head">
    <div>
      共<span class="number">{{ totalCount || 0 }}</span
      >个{{ tabLabel }}
    </div>
    <Pagination v-if="route.path.search(/myFans|myConcern/) !== -1" :page="page" @handleChange="handlePageChange" />
    <el-button v-if="route.path.includes('myWriting') && tabLabel == '提问'" class="btn-question" @click="jumpPublishQs">+ 问题</el-button>
    <el-button v-if="route.path.includes('myWriting') && tabLabel == '博客'" class="btn-question" @click="jumpPublishBlog"
      >+ 博客</el-button
    >
    <el-button v-if="route.path.includes('myWriting') && tabLabel == '题库'" class="btn-question" @click="jumpPublishQsBank"
      >+ 题库</el-button
    >
  </div>
</template>

<script setup>
import Pagination from './Pagination.vue'
const props = defineProps({
  tabLabel: String,
  totalCount: Number,
  menuIndex: Number,
  page: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['handlePageChange'])
const route = useRoute()
const router = useRouter()
const id = route.params.id
const handlePageChange = pageIndex => {
  emit('handlePageChange', pageIndex)
}
const isBtnQuestion = computed(() => {
  return props.menuIndex === 0 && ['回答', '提问'].find(item => item === props.tabLabel)
})
function jumpPublishQs() {
  router.push('/publishQuestion')
}
function jumpPublishBlog() {
  router.push('/publishBlog')
}

function jumpPublishQsBank() {
  const routeUrl = router.resolve({ path: '/questionBank/create' })
  window.open(routeUrl.href, '_blank')
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 20px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
  .number {
    margin: 0 5px;
    color: #0175ff;
  }
  .btn-question {
    height: 32px;
    width: 74px;
    color: #fff;
    background: #0175ff;
    border-radius: 4px;
    font-weight: 400;
    border: none;
    outline: none;
  }
}
</style>
