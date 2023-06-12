<template>
  <div>
    <!-- tab -->
    <CreationSubTab
      ref="subTabRef"
      :list="tabList"
      @handleClick="handleTabClick"
      @search="searchByKey"
    />
    <!-- 内容 -->
    <div class="main">
      <CreationHeader
        :tabLabel="tabLabel"
        :totalCount="totalCount"
        :page="page"
        :menuIndex="menuIndex"
        :operation="operation"
        @handlePageChange="handlePageChange"
      />
      <div class="blogs" v-if="blogs.length">
        <!-- 列表 -->
        <BlogCard
          :blog="item"
          :key="index"
          :menuIndex="menuIndex"
          :showCount="showCount"
          :tabLabel="tabLabel"
          v-for="(item, index) in blogs"
          @delete="handleDelete(item, index)"
          @handleAction="handleAction"
        >
          <template v-slot:operation="{  }"></template>
        </BlogCard>
      </div>
      <div class="bottom-load">
        <el-icon v-if="loading" class="is-loading">
          <Loading />
        </el-icon>
        <span v-else :class="{'more': loadStatus === 2}" @click="loadMore">{{ loadMap[loadStatus] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import CreationHeader from '@/views/creation/components/CreationHeader.vue'
import CreationSubTab from '@/views/creation/components/CreationSubTab.vue'
import BlogCard from '@/views/creation/components/BlogCard.vue'
import { fetchDeleteBlog } from '@/api/personalCenter.js'
import { fetchBlogList } from '@/api/creation.js'
const props = defineProps({
  menuList: { type: String },
  menuIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['updateSidebar'])
let blogs = reactive([])
const subTabRef = ref(null)
const totalCount = ref(0)

const loadStatus = ref(1)
const loading = ref(false)
const loadMap = reactive({
  1: '暂无数据',
  2: '加载更多',
  3: '没有更多了'
})

const operation = ref({
  title: '博客',
  params: {
    path: '/publishBlog'
  }
})
const route = useRoute()
const tab = reactive({
  index: 0,
  subIndex: 0
})

const tabList = computed(() => {
  const list = [0, 1].includes(props.menuIndex)
    ? [
        { label: '已发布', value: 0 },
        { label: '草稿箱', value: 1 }
      ]
    : [{ label: props.menuList[props.menuIndex].label, value: 0 }]
  return list
})
const tabLabel = ref(tabList.value[tab.index].label)
const page = reactive({
  pageIndex: 1,
  pageSize: 9,
  totalPage: 1
})

const showCount = computed(() => {
  return tab.index != 1
})

// 更多
const loadMore = () => {
  if (loadStatus.value === 2) {
    page.pageIndex ++
    getBlogList(subTabRef?.value?.textValue)
  }
}

// tab点击返回 {index, subIndex, label}
const handleTabClick = e => {
  tab.index = e.index
  tab.subIndex = e.subIndex
  tabLabel.value = e.label
  page.pageIndex = 1
  blogs.length = 0
  getBlogList(subTabRef?.value?.textValue)
}

// 删除博客
const handleDelete = (item, index) => {
  ElMessageBox.confirm('确定删除当前博客吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetchDeleteBlog(item.id).then(res => {
      if (res.code == 0) {
        ElMessage.success('删除成功')
        blogs.splice(index, 1)
        totalCount.value--
        if (page.totalPage > 1) {
          page.totalPage = Math.ceil(totalCount.value / page.pageSize)
          //  查询删除后加上的一条数据
          getListOne()
        }
      } else {
        ElMessage.error(res?.msg ||'删除失败')
      }
    })
  })
}

// 点赞，收藏操作，需要更新右侧数据
const handleAction = () => {
  emit('updateSidebar')
}

// 加载完成
const handleFinish = (curr_page, total_page, arr) => {
  if (arr.length === 0) {
    // 暂无数据
    loadStatus.value = 1
  } else if (curr_page < total_page) {
    // 加载更多
    // page.pageIndex = curr_page + 1
    loadStatus.value = 2
  } else if (curr_page === total_page) {
    // 没有更多了
    loadStatus.value = 3
  }
}

// 列表-获取一条
const getListOne = () => {
  const params = {
    entity: {
      status: tab.index == 1 ? 0 : 1,
      keyword: subTabRef?.value?.textValue || ''
    },
    order: 'desc',
    curr_page: blogs.length + 1,
    page_size: 1,
    sidx: ''
  }
  fetchBlogList(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        res.data.list.forEach(item => item.isMore = false)
        blogs.push(...res.data.list)
        handleFinish(page.pageIndex, page.totalPage, blogs)
      }
    })
    .catch(err => console.log(err))
}

// 提问列表
function getBlogList(keyword) {
  const params = {
    entity: {
      status: tab.index == 1 ? 0 : 1,
      keyword: keyword || ''
    },
    order: 'desc',
    curr_page: page.pageIndex,
    page_size: page.pageSize,
    sidx: 'gmt_modified'
  }
  fetchBlogList(params)
    .then(res => {
      if (res.code === 0 && res.data) {
        let data = res.data.list || []
        blogs.push(...data)
        totalCount.value = res.data.total_count
        page.totalPage = res.data.total_page
        handleFinish(res.data.curr_page, res.data.total_page, data)
      }
    })
    .catch(err => console.log(err))
}


const searchByKey = keyword => {
  page.pageIndex = 1
  blogs.length = 0
  getBlogList(keyword)
}

const handlePageChange = pageIndex => {
  console.log(pageIndex)
}

onMounted(() => {
  subTabRef.value.handleTabClick(route.query.index || 0)
})
</script>

<style lang="scss" scoped>
.main {
  width: 910px;
  margin: 20px auto;
  .blogs {
    display: flex;
    flex-wrap: wrap;
  }
  .bottom-load {
    margin-top: 20px;
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
