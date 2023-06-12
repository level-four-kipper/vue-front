<!-- 新增题库 -->
<template>
  <h1>{{pageMessage.title}}</h1>
  <div class="container">
    <div class="content-container">
      <el-form ref="testForm" :model="testFormData" :rules="rules" label-width="140px" :class="test-form" :size="formSize" label-position="top" require-asterisk-position="right" style="margin-top: 15px ">
        <el-form-item label="目标题库" prop="question_bank_id">
          <el-select v-model="testFormData.question_bank_id" placeholder="尚未选择">
            <el-option v-for="(item,index) in questionList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="试题类型" prop="type">
          <el-select v-model="testFormData.type" placeholder="尚未选择">
            <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试题题干" prop="title">
          <el-input v-model="testFormData.title" autosize type="textarea" placeholder="请填写试题题干描述" />
        </el-form-item>
        <el-form-item label="难度等级" prop="difficulty_id">
          <el-select v-model="testFormData.difficulty_id" placeholder="尚未选择">
            <el-option v-for="(item,index) in levelOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试题选项" prop="options" v-show="testFormData.type==='singleSelect' || testFormData.type=== 'multipleSelect'">
          <div class="options-list">
            <div class="one-option" v-for="(item,index) in testOptionData.optionList" :key="index">
              <div class="one-option">
                <div class="option-list">
                  <span class="options">{{item.option}}</span>
                  <input class="input" v-model="item.content" placeholder="填写试题选项" />
                </div>
                <div class="option-answer">
                  <span class="btn-answer-circle" :class="{'is-active':item.is_answer}" @click="setAnswer(index)"></span>
                  <span class="answer-tip">作为正确答案</span>
                </div>
                <div class="option-operate">
                  <img class="subtract" @click="optionSubtract(index)" src="@/assets/img/subtract.png" />
                  <img class="add" @click="optionAdd( )" src="@/assets/img/plus.png" />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 试题类型是判断题 -->
        <el-form-item label="试题答案" prop="answer" v-show="testFormData.type==='judge'">
          <div class="answer-list">
            <el-radio-group v-model="testFormData.answer">
              <el-radio v-for="(item,index) in judgeOptions" :key="index" :label="item.label">{{item.label}}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <!-- 试题类型是编程题 -->
        <el-form-item label="支持编程语言" prop="code" v-show="testFormData.type==='programming'">
          <div class="code-list">
            <el-checkbox-group v-model="testFormData.language" @change="codeChange">
              <el-checkbox v-for="code in testOptionData.codeList" :key="code.label" :label="code.label">{{code.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <div class="addTest-btn">
          <el-button type="primary" @click="EditOrAddTest">{{pageMessage.btnSubmit}}</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, reactive, watch, ref  } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchQuestionBankSet,fetchAddQuestion,fetchQuestionId ,fetchUpdateQuestion} from '@/api/qsBankManage.js'
import {questionType} from '@/views/workPanel/data.js'


const route = useRoute()
const router = useRouter()
const id =  route.params.id 
const pageMessage = reactive( initPageMessage())
const testForm = ref(null)
const questionList = ref([])
const rules = reactive({
  question_bank_id: [{ required: true, message: '请选择目标题库', trigger: 'change' }],
  type: [{ required: true, message: '请选择试题类型', trigger: 'change' }],
  title: [{ required: true, message: '请填写试题题干', trigger: 'blur' }],
  difficulty_id: [{ required: true, message: '请选择试题难度等级', trigger: 'change' }],
  // single: [{ required: true, message: '请填写试题选项', trigger: 'blur' }],
  // options: [{ required: true, message: '请填写试题选项', trigger: 'blur' }],
  // answer: [{ required: true, message: '请选择试题答案', trigger: 'change' }],
  // code: [{ required: true, message: '请选择试题支持编程语言', trigger: 'change' }]
})
const testOptionData= reactive({
   alphabet: ['A', 'B', 'C', 'D', 'E', 'F','G','H'],
   optionList: [
    { option: 'A', content: '', is_answer: false,   },
    { option: 'B', content: '', is_answer: false,   },
    { option: 'C', content: '', is_answer: false,   },
    { option: 'D', content: '', is_answer: false,  },
  ],
   codeList:[
    { value: 'Java',  label: 'Java' },
    { value: 'C',  label: 'C'  },
    { value: 'C++',   label: 'C++' },
    { value: 'Go',  label: 'Go'},
    { value: 'Python',   label: 'Python'},
     ]
  })

const testFormData = reactive({
  question_bank_id: '',
  type: '',
  title: '',
  difficulty_id: '',
  answer:'',
  language:[]
})

//试题类型 [{value,'',label:''}]
const typeOptions =computed(() =>{
  const arr=[]
  for (const key in questionType) {
   arr.push({value:questionType[key].type, label:questionType[key].name})
  }
 return arr
})

const judgeOptions =ref([
  { value:'正确', label: '正确' },
  { value: '错误', label: '错误' },
])
const levelOptions = reactive([
  { value:1, label: '基础' },
  { value: 2, label: '进阶' },
  { value: 3, label: '高级' },
  { value:4, label: '专家' }
])
watch(()=>testFormData.type ,(newVal,oldVal)=>{
  // 题型切换 答案清空
  if(oldVal)
  {
     testOptionData.optionList.forEach(item => item.is_answer = false)
     testFormData.answer = ''
  }
})

watch (() =>  testFormData.language,(newVal)=>{
  testFormData.language = newVal
})


/**
 * 方法
 */
function initPageMessage(){
  let obj =  id ?{
        title:'编辑题目',
        type:'edit',
        btnSubmit:'保存'
    }:{
        title:'添加题目',
        type:'add',
        btnSubmit:'创建'

    }
return obj
}

// 选项减
const optionSubtract = index => {
  testOptionData.optionList.splice(index, 1)
  testOptionData.optionList.forEach((item, index) => {
    item.option = testOptionData.alphabet[index]
  })
}

// 选项加 
const  optionAdd   = ( ) => {
  const item =  { option: testOptionData.alphabet[testOptionData.optionList.length], content: '', is_answer: false,   }
  testOptionData.optionList.push(item)
}
 
function setAnswer(itemIndex){
   testFormData.answer = ''
  if(testFormData.type ==='singleSelect'){
    testOptionData.optionList.forEach((item,index) =>{
       item.is_answer = index === itemIndex  
    })
  }else if(testFormData.type === 'multipleSelect'){
    testOptionData.optionList[itemIndex].is_answer = !testOptionData.optionList[itemIndex].is_answer
  }
   testOptionData.optionList.forEach(item =>  item.is_answer && (testFormData.answer+= item.option ) ) 
}

const cancel = () => {
  router.push('./myTest')
}

/**
 * 请求
 */
function getQsBankList () {
    fetchQuestionBankSet().then(res => {
        if(res.code === 0 && res.data){
      questionList.value = res.data
    }else{
          ElMessage.error( res.msg || res.data.error) 
    }
  })
}

//获取试题信息
function getTestInfo(){
fetchQuestionId( id).then(res => {
  if(res.code === 0 && res.data){
    for (const key  in testFormData) {
      testFormData[key] = res.data[key] 
    }  
    
    if( res.data.option_vo_list){
       testOptionData.optionList =  res.data.option_vo_list.map(item => {
      return  { 
      option:item.option, 
      content: item.content,
      is_answer: testFormData.answer.split('').includes(item.option) }
      })
    }
    
  }else{
    ElMessage.error( res.msg || res.data.error)
  } 
})
}


  //创建或者编辑 
function EditOrAddTest(){
  
  const param = {...testFormData }
  if( param.type === 'singleSelect' || param.type === 'multipleSelect'){
    const optionList = testOptionData.optionList.map(item =>{ return {content:item.content,option:item.option}}) 
    param.option_list = optionList
  }else if(param.type === 'programming'){
    param.language = testFormData.language
  } 
 param.difficulty = '困难'
  testForm.value.validate((valid, fields) => {
    if(valid){
      if ( id) {
        //编辑
          fetchUpdateQuestion({...param,id: id}).then(res => {
          if (res.code === 0) {
            ElMessage.success('保存成功')
            // router.push('/workPanel/myTest')
          } else {
              ElMessage.error( res.msg || res.data.error) 
          }
        })
      } else {
        //新增
        fetchAddQuestion(param).then(res => {
          if (res.code === 0) {
            ElMessage({
              message: '创建试题成功！',
              type: 'success'
            })
            router.push('/workPanel/myTest')
          } else {
            ElMessage.error( res.msg || res.data.error)
          }
        })
      }
    }

  })
}

onMounted(() => {
  getQsBankList()
   id && getTestInfo()
})
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
  // background: hsl(0, 0%, 95%);
  .content-container {
    margin-left: 100px;
    .test-form {
      width: 600px;
    }
    .el-form {
      :deep(.el-form-item__content) {
        width: 15%;
      }
      .el-select {
        display: inline-block;
        position: relative;
        vertical-align: middle;
        line-height: 32px;
        width: 102%;
      }
      .code-list {
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
        }
      }
    }
    .options-list {
      background: #ffffff;
      width: 750px;
      .one-option {
        display: inline-flex;
        justify-content: space-between;
        width: 742px;
        .option-list {
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
        .option-answer {
          margin-top: 5px;
          .btn-answer-circle {
            cursor: pointer;
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid #ccc;
            margin-right: 10px;
            &.is-active {
              background-color: green;
            }
          }

          .content {
            color: #000;
            margin-right: 90px;
          }
        }
        .option-operate {
          margin-top: 5px;
          .subtract {
            width: 25px;
            height: 25px;
            cursor: pointer;
            margin-right: 20px;

            padding-top: 2px;
          }
          .add {
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
