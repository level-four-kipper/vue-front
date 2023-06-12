<!--某一题库下新增试题 -->
<template>
  <h1>添加题目</h1>
  <div class="container">
    <div class="content-container">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
        label-position="top"
        require-asterisk-position="right"
        style="margin-top: 15px "
      >
        <el-form-item label="目标题库" prop="question_bank">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="试题类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="尚未选择">
            <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试题题干" prop="description">
          <el-input v-model="ruleForm.description" autosize type="textarea" placeholder="请填写试题题干描述" />
        </el-form-item>
        <el-form-item label="难度等级" prop="level">
          <el-select v-model="ruleForm.level" placeholder="尚未选择">
            <el-option v-for="(item,index) in levelOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 试题类型是单选题 -->
        <el-form-item label="试题选项" prop="single" v-show="ruleForm.type==='单选题'">
          <div class="options-list">
            <div class="one-option" v-for="(item,index) in ruleForm.singleOptionsList" :key="index">
              <div class="one-option">
                <div class="group1">
                  <span class="options">{{item.option}}</span>
                  <input class="input" v-model="item.content" placeholder="填写试题选项" />
                </div>
                <div class="group2">
                  <el-radio-group v-model="radio" @change="radioChange(index)">
                    <el-radio :label="item.option" :name="item.option">{{item.option}}作为正确答案</el-radio>
                  </el-radio-group>
                </div>
                <div class="group3">
                  <img class="subtract" @click="singleSubtract(index)" src="@/assets/img/subtract.png" v-show="item.del" />
                  <img class="plus" @click="singlePlus" src="@/assets/img/plus.png" v-show="item.add" />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- 试题类型是多选题 -->
        <el-form-item label="试题选项" prop="options" v-show="ruleForm.type==='多选题'">
          <div class="options-list">
            <div class="one-option" v-for="(item,index) in ruleForm.multipleOptionsList" :key="index">
              <div class="one-option">
                <div class="group1">
                  <span class="options">{{item.option}}</span>
                  <input class="input" v-model="item.content" placeholder="填写试题选项" />
                </div>
                <div class="group2">
                  <el-checkbox-group v-model="checkOption" @change="optionChange">
                    <el-checkbox :label="item.option" :name="item.option">{{item.option}}作为正确答案</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="group3">
                  <img class="subtract" @click="multipleSubtract(index)" src="@/assets/img/subtract.png" v-show="item.del" />
                  <img class="plus" @click="multiplePlus" src="@/assets/img/plus.png" v-show="item.add" />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- 试题类型是判断题 -->
        <el-form-item label="试题答案" prop="answer" v-show="ruleForm.type==='判断题'">
          <div class="answer-list">
            <el-radio-group v-model="checkAnswer">
              <el-radio label="正确">正确</el-radio>
              <el-radio label="错误">错误</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <!-- 试题类型是编程题 -->
        <el-form-item label="支持编程语言" prop="code" v-show="ruleForm.type==='编程题'">
          <div class="code-list">
            <el-checkbox-group v-model="checkCode" @change="codeChange">
              <el-checkbox v-for="code in ruleForm.codeList" :label="code" :key="code">{{code}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <div class="addTest-btn">
          <el-button type="primary" @click="goAddTest">创建</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup name="AddTest">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, reactive, watch, ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAddQuestion, fetchQuestionBankId } from '@/api/qsBankManage.js'

const { proxy } = getCurrentInstance()
const name = ref('')
const radio = ref('')
const checkOption = ref([])
const checkAnswer = ref([])
const checkCode = ref([])
const rules = reactive({
  question_bank: [{ required: true, message: '请选择目标题库', trigger: 'blur' }],
  type: [{ required: true, message: '请选择试题类型', trigger: 'change' }],
  description: [{ required: true, message: '请填写试题题干', trigger: 'blur' }],
  level: [{ required: true, message: '请选择试题难度等级', trigger: 'change' }],
  single: [{ required: true, message: '请填写试题选项', trigger: 'blur' }],
  options: [{ required: true, message: '请填写试题选项', trigger: 'blur' }],
  answer: [{ required: true, message: '请选择试题答案', trigger: 'change' }],
  code: [{ required: true, message: '请选择试题支持编程语言', trigger: 'change' }]
})
const ruleForm = reactive({
  type: [],
  description: '',
  level: [],
  singleOptionsList: [
    { option: 'A', content: '', is_answer: false, add: false, del: true },
    { option: 'B', content: '', is_answer: false, add: false, del: true },
    { option: 'C', content: '', is_answer: false, add: false, del: true },
    { option: 'D', content: '', is_answer: false, add: false, del: true }
  ],
  multipleOptionsList: [
    { option: 'A', content: '', is_answer: false, add: false, del: true },
    { option: 'B', content: '', is_answer: false, add: false, del: true },
    { option: 'C', content: '', is_answer: false, add: false, del: true },
    { option: 'D', content: '', is_answer: false, add: false, del: true },
    { option: 'E', content: '', is_answer: false, add: false, del: true },
    { option: 'F', content: '', is_answer: false, add: false, del: true }
  ],
  alphabet: ['A', 'B', 'C', 'D', 'E', 'F'],
  answerList: ['正确', '错误'],
  codeList: ['Java', 'C', 'C++', 'Go', 'Python', 'Linux', 'AI']
})
const typeOptions = reactive([
  //试题类型
  { value: '单选题', label: '单选题' },
  { value: '多选题', label: '多选题' },
  { value: '判断题', label: '判断题' },
  { value: '问答题', label: '问答题' },
  { value: '编程题', label: '编程题' }
])
const levelOptions = reactive([
  //难度等级
  { value: '基础', label: '基础' },
  { value: '进阶', label: '进阶' },
  { value: '高级', label: '高级' },
  { value: '专家', label: '专家' }
])
//接收路由参数
const route = useRoute()
const id = route.query.id //某一题库页面点击添加试题按钮时传过来的题库id
const getQuestionBankName = async () => {
  await fetchQuestionBankId(id).then(res => {
    name.value = res.data.name
  })
}
const codeChange = value => {
  console.log('val', value)
}
const radioChange = index => {
  // 单选
  console.log('index', index)
  console.log('radio', radio.value)
  ruleForm.singleOptionsList[index].is_answer = true
  console.log('singleOptionsList', ruleForm.singleOptionsList)
}
const optionChange = () => {
  //多选
  console.log('checkOption', checkOption.value)
}
const router = useRouter()
const singleSubtract = index => {
  //单选题选项减
  ruleForm.singleOptionsList.splice(index, 1)
  console.log('singleOptionsList', ruleForm.singleOptionsList)
  ruleForm.singleOptionsList.forEach((item, index) => {
    item.option = ruleForm.alphabet[index]
    item.is_answer = false
    item.add = ruleForm.singleOptionsList.length <= 3 ? true : false
    item.del = ruleForm.singleOptionsList.length <= 1 ? false : true
  })
}
const singlePlus = () => {
  //单选题选项加
  const opt = ['A', 'B', 'C', 'D', 'E', 'F']
  const lastOption = ruleForm.singleOptionsList[ruleForm.singleOptionsList.length - 1].option //lastOption是处于optionsList的最后一条数据对象里的选项
  const idx = opt.indexOf(lastOption) //若在opt里有lastOption就返回对应的下标idx
  console.log('ruleForm.singleOptionsList[ruleForm.singleOptionsList.length - 1]', ruleForm.singleOptionsList[ruleForm.singleOptionsList.length - 1])
  console.log('lastOption', lastOption)
  ruleForm.singleOptionsList.push({ option: opt[idx + 1], content: '', is_answer: '', add: false, del: true })
  ruleForm.singleOptionsList.forEach(item => {
    item.del = ruleForm.singleOptionsList.length >= 2 ? true : false
    item.add = ruleForm.singleOptionsList.length >= 4 ? false : true
  })
}
const multipleSubtract = index => {
  //多选题选项减
  ruleForm.multipleOptionsList.splice(index, 1)
  console.log('multipleOptionsList', ruleForm.multipleOptionsList)
  ruleForm.multipleOptionsList.forEach((item, index) => {
    item.option = ruleForm.alphabet[index]
    item.is_answer = false
    item.add = ruleForm.multipleOptionsList.length <= 5 ? true : false
    item.del = ruleForm.multipleOptionsList.length <= 1 ? false : true
  })
}
const multiplePlus = () => {
  //多选题选项加
  const opt = ['A', 'B', 'C', 'D', 'E', 'F']
  const lastOption = ruleForm.multipleOptionsList[ruleForm.multipleOptionsList.length - 1].option //lastOption是处于optionsList的最后一条数据对象里的选项
  const idx = opt.indexOf(lastOption) //若在opt里有lastOption就返回对应的下标idx
  console.log('ruleForm.multipleOptionsList[ruleForm.multipleOptionsList.length - 1]', ruleForm.multipleOptionsList[ruleForm.multipleOptionsList.length - 1])
  console.log('lastOption', lastOption)
  ruleForm.multipleOptionsList.push({ option: opt[idx + 1], content: '', is_answer: '', add: false, del: true })
  ruleForm.multipleOptionsList.forEach(item => {
    item.del = ruleForm.multipleOptionsList.length >= 2 ? true : false
    item.add = ruleForm.multipleOptionsList.length >= 6 ? false : true
  })
}
//创建试题
const goAddTest = async () => {
  const param = {
    type_id: ruleForm.type,
    title: ruleForm.description,
    difficulty_id: ruleForm.level,
    option_dtolist: ruleForm.optionsList,
    question_bank_id: id
  }
  await fetchAddQuestion(param).then(res => {
    console.log('res.code.....................', res.code)
    if (res.code === 0) {
      ElMessage({
        showClose: true,
        message: '创建试题成功！',
        type: 'success'
      })
    } else {
      ElMessage({
        message: '创建试题失败',
        type: 'error'
      })
    }
  })
  router.push('/myTest')
}
//取消
const cancel = () => {
  router.push('/clickQuestionBank')
}
onMounted(() => {
  setTimeout(() => {
    proxy.$refs.ruleFormRef.clearValidate()
  }) //解决一进页面就会触发trigger: “change“表单校验问题
  getQuestionBankName()
})
watch(
  ruleForm.type,
  () => {
    console.log('ruleForm.type', ruleForm.type)
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
h1 {
  margin-left: 100px;
  color: black;
  font-size: large;
  font-weight: 600;
  margin-top: 20px;
}
.container {
  background: hsl(0, 0%, 95%);
  .el-form {
    :deep(.el-form-item__content) {
      width: 15%;
    }
  }
  .content-container {
    margin-left: 100px;
    .el-select {
      display: inline-block;
      position: relative;
      vertical-align: middle;
      line-height: 32px;
      width: 102%;
    }
    .options-list {
      background: #ffffff;
      width: 750px;
      // display: flex;
      // flex-wrap: wrap;
      .one-option {
        display: inline-flex;
        justify-content: space-between;
        width: 742px;
        .group1 {
          margin-left: 50px;
          margin-top: 5px;
          .options {
            color: #000;
            margin-right: 20px;
          }
          .input {
            border: 1px solid #dcdfe6;
            height: 30px;
            margin-right: 70px;
          }
        }
        .group2 {
          margin-top: 5px;
          .circle {
            cursor: pointer;
            margin-right: 15px;
          }
          .content {
            color: #000;
            margin-right: 90px;
          }
        }
        .group3 {
          margin-top: 5px;
          .subtract {
            width: 25px;
            height: 25px;
            cursor: pointer;
            margin-right: 20px;

            padding-top: 2px;
          }
          .plus {
            width: 20px;
            height: 20px;
            cursor: pointer;
            margin-right: 90px;
          }
        }
      }
    }
  }
}
</style>


