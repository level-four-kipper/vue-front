<!-- 创建题库 -->
<template>
  <div class="create-question-bank">
    <div class="title">{{ stepTitle[currentStep - 1] }}</div>
    <div class="content">
      <el-form ref="formRef" :model="model" :rules="rules">
        <template v-if="currentStep == 1">
          <el-form-item label="题库名称：" prop="name">
            <el-input v-model="model.name" maxlength="20" clearable placeholder="请输入题库名称" />
          </el-form-item>
          <el-form-item label="题库分类：" prop="area_id">
            <el-select v-model="model.area_id" filterable clearable placeholder="请选择题库分类">
              <el-option v-for="item in questionBankType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="题库介绍：" prop="description">
            <el-input
              v-model="model.description"
              :rows="5"
              show-word-limit
              maxlength="200"
              type="textarea"
              placeholder="请输入题库介绍"
              clearable />
          </el-form-item>
        </template>
        <template v-if="currentStep == 2">
          <p class="label">请输入对方的邮箱地址，每行一个，每次最多输入10个</p>
          <el-form-item prop="editorEmail">
            <el-input v-model="model.editorEmail" :rows="10" show-word-limit maxlength="200" type="textarea" clearable placeholder="" />
          </el-form-item>
        </template>
        <template v-if="currentStep == 3">
          <p class="label">请输入对方的邮箱地址，每行一个，每次最多输入10个</p>
          <el-form-item prop="auditorEmail">
            <el-input v-model="model.auditorEmail" :rows="10" show-word-limit maxlength="200" type="textarea" clearable placeholder="" />
          </el-form-item>
          <el-form-item label="审核策略：" prop="audit_policy">
            <el-select v-model="model.audit_policy" placeholder="请选择审核策略">
              <el-option v-for="item in auditPolicyList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="button">
      <el-button @click="handleCancel">取消</el-button>
      <div>
        <el-button :type="currentStep == 3 ? 'primary' : ''" @click="handleNextStep(2)">
          <img src="@/assets/img/创建-1.png" alt="" />
          <span>完成创建</span>
        </el-button>
        <el-button v-if="currentStep !== 3" type="primary" @click="handleNextStep(1)">
          <img src="@/assets/img/设置-1.png" alt="" />
          <span>继续完善设置</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup name="createQuestionBank">
import useQuestionbank from '@/hooks/useQuestionbank'
import { ElMessage } from 'element-plus'
import { fetchMemberInfo, fetchAddQuestionbank } from '@/api/questionBank.js'

const router = useRouter()

const currentStep = ref(1)
const formRef = ref()
const model = ref({
  name: '',
  area_id: '',
  description: '',
  audit_policy: 0,
  editorEmail: '',
  auditorEmail: '',
})
const rules = ref({
  name: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
  area_id: [{ required: true, message: '请选择题库分类', trigger: ['blur', 'change'] }],
  description: [{ required: true, message: '请输入题库介绍', trigger: 'blur' }],
  editorEmail: [{ validator: emailValidate }],
  auditorEmail: [{ validator: emailValidate }],
})
const editorList = ref([])
const auditorList = ref([])

const stepTitle = ['填写题库信息', '添加编辑人员', '添加审核人员']
const fields = ['name,area_id,description', 'editorEmail', 'auditorEmail']
const { emailReg, auditPolicyList, questionBankType, _fetchGetQuestionBankType } = useQuestionbank() // 审核策略 题库类型

// 检查数组中重复的元素
function duplicates(arr) {
  const setter = new Set()
  const temp = new Set()
  for (const item of arr) {
    if (setter.has(item)) {
      temp.add(item)
    } else {
      setter.add(item)
    }
  }
  return Array.from(temp)
}

// 邮箱校验规则
function emailValidate(rule, value, callback) {
  const arr = value.split('\n').filter(item => item)
  const errorEmail = []
  arr.forEach(item => {
    const emailStr = item.trim()
    if (emailStr && !emailReg.test(emailStr)) {
      errorEmail.push(emailStr)
    }
  })
  if (errorEmail.length > 0) {
    callback(new Error(`邮箱格式错误：${errorEmail.join(',')}`))
  } else if (duplicates(arr).sort().length > 0) {
    callback(new Error(`存在重复的邮箱：${duplicates(arr).sort().join(',')}`))
  } else if (arr.length > 10) {
    callback(new Error(`最多只能10个邮箱`))
  } else {
    callback()
  }
}
// 手动删除动态添加的规则
const delValidator = () => {
  if (rules.value[currentStep.value == 2 ? 'editorEmail' : 'auditorEmail'].length > 1) {
    rules.value[currentStep.value == 2 ? 'editorEmail' : 'auditorEmail'] = rules.value[
      currentStep.value == 2 ? 'editorEmail' : 'auditorEmail'
    ].slice(0, 1)
  }
}
// 继续完善设置 完成创建
const handleNextStep = type => {
  // 检查邮箱
  if (currentStep.value == 2 || currentStep.value == 3) {
    delValidator()
    formRef.value.validateField(fields[currentStep.value - 1].split(','), valid => {
      if (!valid) return
      const params = model.value[currentStep.value == 2 ? 'editorEmail' : 'auditorEmail']
        .split('\n')
        .filter(item => item)
        .join(',')
      params &&
        fetchMemberInfo(params)
          .then(res => {
            if (res.msg !== 'success') {
              // 动态添加规则
              rules.value[currentStep.value == 2 ? 'editorEmail' : 'auditorEmail'].push({
                validator: (rule, value, callback) => {
                  callback(new Error(res?.msg?.replace(/\\n/g, ' ')))
                },
                trigger: 'blur',
              })
              formRef.value.validateField([currentStep.value == 2 ? 'editorEmail' : 'auditorEmail']) // 手动校验
              return
            }
            const { bank_manage_volist = [] } = res.data || []
            const list = bank_manage_volist.map(item => {
              const { img_url = '', user_id = '', username = '' } = item
              return {
                img_url,
                user_id,
                username,
              }
            })
            // 去重，删除原列表，push新列表
            if (currentStep.value == 2) {
              editorList.value = list.map(item => {
                return { ...item, role_id: 1 }
              })
            } else {
              auditorList.value = list.map(item => {
                return { ...item, role_id: 2 }
              })
            }
            delValidator()
            formCheck(type)
          })
          .catch(err => {
            console.log('err', err)
          })
    })
  } else {
    formCheck(type)
  }
}
// 表单校验
const formCheck = type => {
  formRef.value.validateField(fields[currentStep.value - 1].split(','), valid => {
    if (!valid) return
    if (type == 1) {
      currentStep.value += 1
    } else {
      submitInfo()
    }
  })
}
// 提交
const submitInfo = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    const { name, area_id, description, audit_policy } = model.value
    const params = { info: { name, area_id, description, audit_policy } }
    params.editors = editorList.value || []
    params.auditors = auditorList.value || []
    fetchAddQuestionbank(params)
      .then(res => {
        if (res.code !== 0) {
          return ElMessage.error(res.msg || '创建题库失败')
        }
        // 跳转到题库-编辑
        router.push({ path: '/questionBank/editor', query: { id: res?.data } })
      })
      .catch(err => console.log('err', err))
  })
}
// 取消
const handleCancel = () => {
  formRef.value.resetFields()
  // 跳转到创造空间-题库
  router.replace(`/creationList/quizBank`)
}
onMounted(() => {
  _fetchGetQuestionBankType()
})
</script>

<style lang="scss" scoped>
.create-question-bank {
  background-color: #f5f8fe;
  padding: 20px;

  .title,
  .content,
  .button {
    width: 1160px;
    margin: 0 auto;

    .el-button {
      img {
        margin-right: 5px;
        vertical-align: middle;
      }
    }
  }

  .title,
  .content {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 16px 20px;
    border-radius: 4px;
  }

  .title {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }

  .content {
    height: 450px;

    :deep(.el-form) {
      .el-form-item {
        margin-bottom: 20px;

        .el-form-item__label {
          color: #333333;
          padding-right: 0;
        }

        .el-input,
        .el-select {
          width: 520px;
        }

        .el-input__wrapper,
        .el-textarea__inner {
          border-radius: 2px;

          .el-input__inner {
            height: 36px;
          }
        }
      }

      // 必填 * 样式
      .el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before {
        margin-right: 8px;
        color: #da3939;
      }
    }

    .label {
      color: #333333;
      margin-bottom: 16px;
    }
  }

  .button {
    display: flex;
    justify-content: space-between;

    .el-button {
      font-size: 16px;
      height: 42px;
    }

    .el-button:last-child {
      margin-left: 20px;
    }
  }
}
</style>
