<template>
  <div class="inputquestion">
    <div class="main-list">
      <div class="ask">编辑问题</div>
      <div class="main-body">
        <div class="header">问题信息</div>
        <el-divider />
        <!-- Input 输入框 -->
        <div class="title"><span>问题标题：</span><el-input v-model="questiontitle" show-word-limit="40" type="text" maxlength="40" /></div>
        <div class="title"><span style="vertical-align:top;">问题描述：</span> <el-input v-model="questiondiscribe" resize="none" show-word-limit maxlength="200" type="textarea" :autosize="{ minRows:6,maxRows: 6 }" /></div>
        <!-- select 选择器 -->
        <div class="title">
          问题标签：
          <div class="select">
            <!-- <el-tree-select v-model="questiontag" :render-after-expand="false" class="m-2" multiple :data="data">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-tree-select> -->
            <el-tag v-for="item in list_tags" :key="item" effect="light" size="large" closable :disable-transitions="false" @close="() => handleClose(item)">
              {{ item }}
            </el-tag>
            <el-input v-model="questiontag" placeholder="请输入标签，按对号键添加">
              <template #suffix>
                <img src="@/assets/img/creation/saveTag.png" @click="saveTag" />
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <footer>
        <!-- Button 按钮 -->
        <el-button type="primary" @click="jumpWorkPanelPublic('public')">保存至已发布</el-button>
        <el-button class="plain" @click="jumpWorkPanelDraft('draft')">保存至草稿箱</el-button>
      </footer>
    </div>
  </div>
</template>

<script setup name="Question">
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/utils/https.js'
import { fetchEdit } from '@/api/answer.js'
const router = useRouter()
const route = useRoute()
const input = ref('')
const tabPostion = ref('left')
const questiontitle = ref('')
const questiondiscribe = ref('')
const questiontag = ref([])
const list_tags = ref([])

const publishedSelected = ref(true)
// const item = reactive ({
//   id:'',
//   title:'',
//   content :'',
//   tag: '',
// })
// 跳转更新
const jumpWorkPanelPublic = function (type) {
  http
    .post('/quiz/create', {
      title: questiontitle.value,
      content: questiondiscribe.value,
      list_tags: questiontag.value,
      status: 0,
      issue: type === 'public' ? 0 : 1,
      hide: 0
    })
    .then(res => {
      if (res.code === 0) {
        router.push('/myQuestion/1')
      } else {
        ElMessage({
          message: res.msg || res.data.error,
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const jumpWorkPanelDraft = function (type) {
  http
    .post('/quiz/create', {
      title: questiontitle.value,
      content: questiondiscribe.value,
      list_tags: questiontag.value,
      status: 0,
      issue: type === 'public' ? 0 : 1,
      hide: 0
    })
    .then(res => {
      if (res.code === 0) {
        router.push('/myQuestion/2')
      } else {
        ElMessage({
          message: res.msg || res.data.error,
          type: 'error'
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
//标签
const saveTag = () => {
  list_tags.value.push(questiontag.value)
  questiontag.value = ''
}
const handleClose = (item) => {
  list_tags.value.splice(list_tags.value.indexOf(item), 1)
}
// 请求编辑回显
function getMyAsk() {
  fetchEdit(route.params.id)
    .then(res => {
      questiontitle.value = res.data.title
      questiondiscribe.value = res.data.content
      questiontag.value = res.data.list_tags
    })
    .catch(err => console.log(err))
}
onMounted(() => {
  console.log(route.params.id)
  getMyAsk()
})
defineExpose({
  publishedSelected
})
</script>

<style scoped lang="scss">
.el-tag {
  font-size: 20px;
}
.inputquestion {
  display: flex;
  background-color: #f5f8fe;
  position: absolute;
  width: 100%;
  height: 100%;
  .p {
    font-weight: 700;
    font-size: 15px;
  }
  .title {
    padding: 15px 0;
    margin-bottom: 5px;
  }

  .submit {
    height: 20px;
    width: 50px;
  }
  .main-list {
    width: 1000px;
    margin-left: 250px;
    .ask {
      padding: 12px 45px;
      background-color: white;
      margin-top: 20px;
      font-size: 18px;
      line-height: 30px;
      font-weight: 600;
    }
    .main-body {
      background-color: white;
      margin-top: 30px;
      padding: 12px 45px;
      .header {
        height: 15px;
        line-height: 30px;
      }
      :deep(.el-input) {
        width: 90%;
      }
      :deep(.el-textarea) {
        width: 90%;
      }
      .select {
        display: inline-block;
        width: 90%;
        :deep(.el-input__wrapper) {
          height: 52px;
          width: 50px;
        }
        :deep(.is-closable){
          margin-right: 12px;
          margin-bottom: 5px;
          span{
            font-size: 14px;
          }
        }
      }
    }
  }
  footer {
    padding: 25px 0;
    a {
      color: rgb(104, 104, 236);
      float: right;
    }
  }
}
</style>
