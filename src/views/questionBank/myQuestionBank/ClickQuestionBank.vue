<!-- 点击某一题库之后跳转到的页面 -->
<template>
  <div v-if="currentRouterName !== 'addMember'">
    <div class="description">
      <div class="question">
        <div>
          <!-- 'data:image/png:base64,' -->
          <img class="questionBank-icon" :src="'data:image/jpeg;base64,'+ questionBankList.pictureUrl " alt="icon" />
          <button class="questionBank-type">{{questionBankList.area}}</button>
        </div>

        <div class="questionBank-description">
          <p class="title">{{questionBankList.name}}</p>
          <!-- title属性，鼠标悬停展示全部内容 -->
          <p class="content" :title="questionBankList.description">{{questionBankList.description}}</p>
          <span class="detail">{{questionBankList.creator}} 创建于 {{questionBankList.gmt_created}}</span>
        </div>
      </div>
    </div>
    <div class="below">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" @tab-change="tabChange">
        <el-tab-pane label="题目列表" name="1"
          ><QuestionList :tableData="tableData" :total="total" @sizeChange="getsizeChange" @currentChange="getcurrentChange" @search="getsearch" @delQuestion="delQuestion" />
        </el-tab-pane>
        <el-tab-pane label="题库设置" name="0"
          ><QuestionBankSet :roleData="roleData" :roleTotal="roleTotal" @sizeChange="getsizeChange" @currentChange="getcurrentChange" @handleCommand="getHandleCommand" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <RouterView v-else />
</template>
 
<script setup name="ClickQuestionBank">
import QuestionList from './QuestionList.vue'
import QuestionBankSet from './QuestionBankSet.vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchQuestionBankId } from '@/api/questionBank.js'
import { fetchQuestion } from '@/api/questionBank.js'
import { fetchDeleteQuestion } from '@/api/questionBank.js'
import { fetchQuestionBankUser } from '@/api/questionBank.js'
import { fetchPicture } from '@/api/questionBank.js'
import { ElMessage, ElMessageBox } from 'element-plus'
let tableData = ref([]) // 试题表格数据
let roleData = ref([]) // 用户表格数据
let total = ref(0) //试题数据总条数
let roleTotal = ref(0) //用户数据总条数
// tabs标签页默认选中第一个
const activeName = ref('1')
const queryInfo = reactive({
  pageSize: 10, //每页条数
  currentPage: 1, //当前页
  keywords: '',
  gmt_created: ''
})
//接收路由参数
const route = useRoute()
const activeTab = route.query.tab //点击配置按钮时路由传tab
activeName.value = activeTab //当前tab名等于传过来的tab
const id = route.query.id //我的题库页面点击题库名称时传过来的题库id
const questionBankId = route.query.questionBankId //更新/新增题库页面传过来的题库id
const idSet = route.query.idSet //点击配置按钮时传过来的题库id
// 删除试题
const delQuestion = idDelete => {
  ElMessageBox.confirm('是否确定删除该试题？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      fetchDeleteQuestion(idDelete).then(res => {
        console.log('res', res)
        const index = tableData.value.findIndex(function (item) {
          return item.id == idDelete
        })
        tableData.value.splice(index, 1)
        total.value = total.value - 1
        console.log('total.value', total.value)
        console.log('tableData.value', tableData.value)
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '删除试题成功!'
          })
        } else {
          ElMessage({
            type: 'error',
            message: '删除试题失败!'
          })
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消!'
      })
    })
}
const getsearch = () => {
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  // 获取数据
  getList()
  console.log('getsearch', tableData.value)
}
const getsizeChange = val => {
  queryInfo.pageSize = val
  getList()
}
const getcurrentChange = val => {
  queryInfo.currentPage = val
  getList()
}
//改变角色    val是command属性的值，id是roleData的user_id
const getHandleCommand =(val, id) =>{
  roleData.value.forEach(item => {
    if (item.user_id === id) {
      item.role = val
    }
  })
}
//获取试题表格数据
const getList = async () => {
  let paramId
  if (id) {
    paramId = id
  } else if (questionBankId) {
    paramId = questionBankId
  } else if (idSet) {
    paramId = idSet
  }
  const param = {
    curr_page: queryInfo.currentPage, //当前页
    page_size: queryInfo.pageSize, //每页数据
    sidx: queryInfo.gmt_created, //排序字段-创建时间
    entity: {
      // status_id: activeName.value,
      keywords: queryInfo.keywords,
      question_bank_id: paramId //id是题库id
    }
  }
  //接口联调 查询某一题库下的所有试题
  await fetchQuestion(param)
    .then(res => {
      total.value = res.data.total_count || 0
      tableData.value = res.data.list || []
      console.log('res.data', res.data)
      if (res.code !== 0) {
        ElMessage({
          message: '获取试题数据失败！',
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log('err', err)
      ElMessage({
        message: err,
        type: 'error'
      })
    })
}
//获取用户表格数据
const getUser = async () => {
  let question_bank_id
  if (id) {
    question_bank_id = id
  } else if (idSet) {
    question_bank_id = idSet
  } else if (questionBankId) {
    question_bank_id = questionBankId
  }
  let param = {
    curr_page: queryInfo.currentPage, //当前页
    page_size: queryInfo.pageSize, //每页数据
    entity: {
      question_bank_id
    }
  }
  console.log('question_bank_id...........', question_bank_id)
  await fetchQuestionBankUser(param).then(res => {
    roleTotal.value = res.data.total_count || 0
    roleData.value = res.data.list || []
  })
  console.log('roleData.value ', roleData.value)
}
onMounted(() => {
  getList()
  getUser()
})

const handleClick = (tab, event) => {
  console.log(tab, event)
}
const currentRouterName = computed(() => {
  return useRoute().name
})
const tabChange = val => {
  // localStorage.removeItem('type')
  localStorage.setItem('type', activeName.value) //将tab标签名存储到type字段， 以键值对key:value的形式存储到本地
  activeName.value = val
  queryInfo.keywords = ''
  queryInfo.pageSize = 10
  queryInfo.currentPage = 1
  getList()
}
//调接口拿到questionBankList
let questionBankList = reactive({
  area: '',
  icon: '',
  name: '',
  description: '',
  creator: '',
  gmt_created: '',
  pictureUrl: ''
})
//从我的题库页面点击题库名称时传题库id至ClickQuestionBank页面后调接口获得题库相关信息
const getInfo = async () => {
  //接口联调
  await fetchQuestionBankId(id)
    .then(res => {
      console.log('res.data', res.data),
        (questionBankList.area = res.data.area),
        (questionBankList.icon = res.data.icon),
        (questionBankList.name = res.data.name),
        (questionBankList.description = res.data.description),
        (questionBankList.creator = res.data.creator),
        (questionBankList.gmt_created = res.data.gmt_created)
      const path = questionBankList.icon
      fetchPicture(path).then(res => {
        //根据后端传回来的相对路径去调接口拿到图片显示出来
        questionBankList.pictureUrl = res.data
      })
      if (res.code !== 0) {
        ElMessage({
          message: '获取题库数据失败！',
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log('err', err)
      ElMessage({
        message: err,
        type: 'error'
      })
    })
}
//点击配置按钮时传题库id至ClickQuestionBank页面后调接口获得题库相关信息
const getSetInfo = async () => {
  //接口联调
  await fetchQuestionBankId(idSet)
    .then(res => {
      console.log('res.data', res.data),
        (questionBankList.icon = res.data.icon),
        (questionBankList.name = res.data.name),
        (questionBankList.description = res.data.description),
        (questionBankList.creator = res.data.creator),
        (questionBankList.gmt_created = res.data.gmt_created),
        (questionBankList.area = res.data.area)
      const path = questionBankList.icon
      fetchPicture(path).then(res => {
        //根据后端传回来的相对路径去调接口拿到图片显示出来
        questionBankList.pictureUrl = res.data
      })
      if (res.code !== 0) {
        ElMessage({
          message: '获取题库数据失败！',
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log('err', err)
      ElMessage({
        message: err,
        type: 'error'
      })
    })
}
// 从新增题库页面点击题库名称时传题库id至ClickQuestionBank页面后调接口获得题库相关信息
const getQuestionBankInfo = async () => {
  await fetchQuestionBankId(questionBankId).then(res => {
    console.log('res', res),
      (questionBankList.icon = res.data.icon),
      (questionBankList.name = res.data.name),
      (questionBankList.description = res.data.description),
      (questionBankList.creator = res.data.creator),
      (questionBankList.gmt_created = res.data.gmt_created),
      (questionBankList.area = res.data.area)
    const path = questionBankList.icon
    fetchPicture(path).then(res => {
      //根据后端传回来的相对路径去调接口拿到图片显示出来
      questionBankList.pictureUrl = res.data
    })
  })
}
onMounted(() => {
  if (idSet) getSetInfo()
  else if (id) getInfo()
  else getQuestionBankInfo()
  console.log('useRouter', useRoute())
  const type = localStorage.getItem('type') //获取tab标签名
  type && (activeName.value = type)
})
onUnmounted(() => {
  localStorage.removeItem('type') //删除存储在本地的tab标签名
})
</script>
<style lang="scss" scoped>
// Tabs标签页样式
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.description {
  height: 150px;
  .question {
    // background-color:#f2f2f2;
    height: 20%;
    display: flex;
    .questionBank-icon {
      min-width: 60px;
      height: 60px;
      margin-left: 250px;
      margin-top: 20px;
    }
    .questionBank-type {
      border: 1px solid #faad14;
      margin-left: 250px;
      margin-top: 10px;
      border-radius: 20px;
      min-width: 83px;
      min-height: 30px;
      background-color: #faad14;
      color: #fff;
    }
    .questionBank-description {
      display: flex;
      flex-flow: wrap;
      .title {
        font-weight: bold;
        font-size: 20px;
        width: 1000px;
        margin-top: 20px;
        margin-left: 30px;
      }
      .content {
        width: 400px;
        margin-left: 30px;
        color: black;
        margin-bottom: 1%;
        margin-top: 1%;
        font-size: 16px;
        overflow: hidden; //超出部分隐藏
        text-overflow: ellipsis; //用一个省略号代替超出的内容
        display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; //限制行数
        // &:hover{
        //   text-overflow: inherit;
        //   overflow: visible;
        //   white-space: pre-line;
        // }
      }
      .detail {
        margin-left: 30px;
        width: 1000px;
        color: black;
        font-size: 16px;
      }
    }
  }
}
.below {
  margin-left: 40px;
  :deep(.el-button) {
    position: relative;
    margin-bottom: 20px;
    margin-top: 10px;
  }
}
</style>