<template>
  <div class="inputquestion">
    <!-- 创作/提问题 -->
    <header>
      <el-tabs :tab-position="tabPostion" v-model="tabName" @tab-click="handleClick">
        <el-tab-pane label="创作" name="1"></el-tab-pane>
        <el-tab-pane label="提问" name="2"></el-tab-pane>
      </el-tabs>
    </header>
    <div class="main-list">
      <div class="ask">提问题</div>
      <div class="main-body">
        <div class="header">问题信息</div>
        <el-divider />
        <!-- Input 输入框 -->
        <div class="title"><span>问题标题：</span><el-input v-model="questiontitle" placeholder="请输入问题" show-word-limit="40" /></div>
        <div class="title">
          <span style="vertical-align:top;">问题描述：</span>
          <el-input class="discribe" v-model="questiondiscribe" size="large" type="textarea" placeholder="请对问题进行补充描述，可尽快获得大家的解答" rows="6" />
        </div>
        <!-- select 选择器 -->
        <div class="title">
          问题标签：
          <div class="select">
            <el-tree-select v-model="questiontag" :render-after-expand="false" multiple :data="data" placeholder="题目标签">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-tree-select>
          </div>
        </div>
      </div>
      <footer>
        <!-- Button 按钮 -->
        <el-button type="primary" @click="jumpWorkPanelPublic('public')">发布问题</el-button>
        <el-button class="plain" @click="jumpWorkPanelDraft('draft')">发布至草稿箱</el-button>
      </footer>
    </div>
  </div>
</template>

<script setup name="Question">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/https.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { result } from 'lodash-es'

const router = useRouter()
const input = ref('')
const tabPostion = ref('left')
const questiontitle = ref('')
const questiondiscribe = ref('')
const questiontag = ref([])
const tabName = ref('2')
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
// tag列表
const data = [
  {
    value: '1',
    label: '前端',
    children: [
      {
        value: 'css',
        label: 'css'
      },
      {
        value: 'html5',
        label: 'html5'
      },
      {
        value: 'javascript',
        label: 'javascript'
      },
      {
        value: 'react.js',
        label: 'react.js'
      },
      {
        value: 'javavue.js',
        label: 'javavue.js'
      }
    ]
  },
  {
    value: '2',
    label: '后端',
    children: [
      {
        value: 'mysql',
        label: 'mysql'
      },
      {
        value: 'node.js',
        label: 'node.js'
      },
      {
        value: 'ruby',
        label: 'ruby'
      },
      {
        value: 'mysql',
        label: 'mysql'
      },
      {
        value: 'Springboot',
        label: 'Springboot'
      }
    ]
  },
  {
    value: '3',
    label: '数据结构与算法',
    children: [
      {
        value: '链表',
        label: '链表'
      },
      {
        value: '哈希算法',
        label: '哈希算法'
      },
      {
        value: '排序算法',
        label: '排序算法'
      },
      {
        value: 'leetcode',
        label: 'leetcode'
      },
      {
        value: '贪心算法',
        label: '贪心算法'
      }
    ]
  }
]
// 创作跳转
const handleClick = tab => {
  if (tab.index == 0) {
    // router.push('/writeBlog')
    router.push('/publishBlog')
  }
}
</script>

<style scoped lang="scss">
.inputquestion {
  display: flex;
  background-color: #f5f8fe;
  position: absolute;
  width: 2000px;
  .el-tabs {
    // position: relative;
    margin: 8px 200px;
    --el-tabs-header-height: 60px;
    background-color: white;
    height: 130px;
    width: 300px;
  }

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
  header {
    float: left;
  }
  .main-list {
    float: right;
    width: 1000px;
    margin: -5px -120px;
    .ask {
      // position: absolute;
      // // flex: 1;
      // // cursor: pointer;
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
