<!-- 题库设置 -->
<template>
  <el-drawer
    v-model="visible"
    :show-close="false"
    destroy-on-close
    close-on-click-modal
    close-on-press-escape
    size="460"
    @close="handleClose">
    <div v-loading="loading" class="setting__warp">
      <img class="back-image" src="@/assets/img/creation/showSetting.png" @click="handleClose" />
      <el-form ref="formRef" v-loading="loading" :model="model" :rules="rules" label-position="top">
        <el-tabs v-model="currentStep">
          <el-tab-pane label="基本设置" :name="1">
            <el-form-item label="题库名称" prop="name">
              <el-input v-model="model.name" maxlength="20" clearable placeholder="请输入题库名称" :disabled="!!roleId" />
            </el-form-item>
            <el-form-item label="题库分类" prop="area_id">
              <el-select v-model="model.area_id" :disabled="!!roleId" clearable placeholder="请选择题库分类">
                <el-option v-for="item in questionBankType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="题库介绍" prop="description">
              <el-input
                v-model="model.description"
                :rows="5"
                show-word-limit
                maxlength="200"
                type="textarea"
                placeholder="请输入题库介绍"
                clearable
                :disabled="!!roleId" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="编辑设置" :name="2">
            <SearchBox ref="searchRef" v-model:keyword="searchVal" placeholder="搜索成员" />
            <div class="member__title">
              <label>编辑成员</label>
              <div v-if="!roleId" class="member__add-btn" @click="addMemberBefore">
                <img src="@/assets/img/createQuestionBank/add2.png" alt />
                <span>添加</span>
              </div>
            </div>
            <div class="member__list">
              <template v-for="(item, idx) in editorListComputed" :key="idx">
                <div class="member__item">
                  <el-image :src="item.img_url" />
                  <div class="member__name">{{ item.username }}</div>
                  <div v-if="!roleId" class="member__del-btn" @click="handleDelete(item.user_id)">
                    <div>
                      <img src="@/assets/img/createQuestionBank/del.png" />
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="审核设置" :name="3">
            <SearchBox ref="searchRef" v-model:keyword="searchVal" placeholder="搜索成员" />
            <div class="member__title">
              <label>审核成员</label>
              <div v-if="!roleId" class="member__add-btn" @click="addMemberBefore">
                <img src="@/assets/img/createQuestionBank/add2.png" />
                <span>添加</span>
              </div>
            </div>
            <div class="member__list">
              <template v-for="(item, idx) in auditorListComputed" :key="idx">
                <div class="member__item">
                  <el-image :src="item.img_url" />
                  <div class="member__name">{{ item.username }}</div>
                  <div v-if="!roleId" class="member__del-btn" @click="handleDelete(item.user_id)">
                    <div>
                      <img src="@/assets/img/createQuestionBank/del.png" />
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="member__title">
              <label>审核策略</label>
            </div>
            <div class="audit-policy__list">
              <div
                v-for="item in auditPolicyList"
                :key="item.value"
                class="policy"
                :class="{ active: item.value == model.audit_policy }"
                :data-value="item.value"
                @click="auditPolicyChange(item.value)">
                {{ item.label }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="submit-btn">
        <el-button class="submit-btn" @click="submitInfo">
          <img src="@/assets/img/创建-1.png" alt="" />
          <span>保存编辑</span>
        </el-button>
      </div>
    </div>
  </el-drawer>
  <!-- 添加成员弹窗 -->
  <CustomDialog
    v-model:dialogVisible="dialogVisible"
    :title="`添加${currentStep === '2' ? '编辑' : '审核'}成员`"
    tips="请输入对方的邮箱地址，每行一个，每次最多输入10个"
    @handle-confirm="addMemberConfirm" />
</template>

<script setup name="editQuestionBank">
import SearchBox from '../management/components/SearchBox.vue'
import CustomDialog from '../management/components/CustomDialog.vue'

import { fetchMemberInfo, fetchEditQuestionbank, fetchManagerMember } from '@/api/questionBank.js'
import { ElMessage } from 'element-plus'
import useQuestionbank from '@/hooks/useQuestionbank'

const visible = ref(false)
const loading = ref(false)
const dialogVisible = ref(false)

const currentStep = ref(1)
const formRef = ref()
const model = ref({
  name: '',
  area_id: '',
  description: '',
  audit_policy: 0,
})
const rules = ref({
  name: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
  area_id: [{ required: true, message: '请选择题库分类', trigger: ['blur', 'change'] }],
  description: [{ required: true, message: '请输入题库介绍', trigger: 'blur' }],
})
const editorList = ref([])
const auditorList = ref([])
const { emailReg, auditPolicyList, questionBankType, _fetchGetQuestionBankType, _fetchGetQuestionbank } = useQuestionbank() // 审核策略 题库类型

let id = ''
const roleId = ref(0)

// 搜索成员
const searchRef = ref()
const searchVal = ref('')
const editorListComputed = computed(() => {
  if (!searchVal.value) {
    return editorList.value
  } else {
    return editorList.value.filter(item => item.username.includes(searchVal.value))
  }
})
const auditorListComputed = computed(() => {
  if (!searchVal.value) {
    return auditorList.value
  } else {
    return auditorList.value.filter(item => item.username.includes(searchVal.value))
  }
})
// 添加成员前校验
const addMemberBefore = () => {
  if ((currentStep.value == 2 && editorList.value.length >= 10) || (currentStep.value == 3 && auditorList.value.length >= 10)) {
    ElMessage({
      message: `当前已有10个成员，不可再添加`,
      type: 'warning',
    })
  } else {
    dialogVisible.value = true
  }
}
// 添加成员：确认
const addMemberConfirm = emailStr => {
  if (emailStr === '') return
  const arr = emailStr.split('\n').filter(item => item)
  let errorEmail = []
  let succeedEmail = []
  arr.forEach(item => {
    const email = item.split('\n')
    if (email && !emailReg.test(email)) {
      errorEmail.push(email)
    } else {
      succeedEmail.push(email)
    }
  })
  if (errorEmail.length) {
    ElMessage({
      message: `邮箱格式错误：${errorEmail.join(',')}`,
      type: 'warning',
    })
    return
  }
  // 去重
  succeedEmail = [...new Set(...succeedEmail)]
  if (!succeedEmail.length) {
    ElMessage({
      message: `邮箱不能为空`,
      type: 'warning',
    })
    return
  }
  // 邮箱检查，获取可用的邮箱
  const params = succeedEmail.slice(0, 10).join(',')
  fetchMemberInfo(params).then(res => {
    if (res.code !== 0) {
      ElMessage({
        dangerouslyUseHTMLString: true,
        message: res?.msg?.replace(/\\n/g, '<br/>'),
        type: 'warning',
      })
      return
    }
    dialogVisible.value = false
    const { bank_manage_volist = [] } = res.data || []
    const list = bank_manage_volist.map(item => {
      const { img_url, user_id, username } = item
      return {
        img_url,
        user_id,
        username,
      }
    })
    // 去重
    if (currentStep.value == 2) {
      const allList = [...editorList.value, ...list]
      const newList = []
      allList.forEach(item => {
        const flag = newList.some(i => i.id === item.id)
        !flag && newList.push(item)
      })
      editorList.value = newList.map(item => {
        return { ...item, role_id: 1, question_bank_id: id }
      })
    } else {
      const allList = [...auditorList.value, ...list]
      const newList = []
      allList.forEach(item => {
        const flag = newList.some(i => i.id === item.id)
        !flag && newList.push(item)
      })
      auditorList.value = newList.map(item => {
        return { ...item, role_id: 2, question_bank_id: id }
      })
    }
  })
}
// 删除成员
const handleDelete = userId => {
  if (currentStep.value == 2) {
    editorList.value = editorList.value.filter(item => {
      return item.user_id !== userId
    })
  } else {
    auditorList.value = auditorList.value.filter(item => {
      return item.user_id !== userId
    })
  }
}
// 改变审核策略
const auditPolicyChange = val => {
  if (roleId.value !== 0) return
  model.value.audit_policy = val
}
// 打开
const handleOpen = val => {
  visible.value = true
  id = val || ''
  _fetchGetQuestionBankType()
  if (id) {
    getDetail()
    _fetchManagerMemberByEdit()
    _fetchManagerMemberByAudit()
  }
}
// 关闭
const handleClose = () => {
  visible.value = false
  loading.value = false
  currentStep.value = 1
  formRef.value.resetFields()
  editorList.value = []
  auditorList.value = []
}
// 获取详情
const getDetail = () => {
  _fetchGetQuestionbank(id).then(res => {
    Object.keys(model.value).forEach(item => {
      model.value[item] = res[item]
    })
    roleId.value = res?.role_id || 0
  })
}
// 获取编辑人员
const _fetchManagerMemberByEdit = () => {
  fetchManagerMember({ question_bank_id: id, role_id: 1 })
    .then(res => {
      if (res.code !== 0) {
        return ElMessage.error(res.msg || '获取编辑人员失败')
      }
      editorList.value = res.data || []
    })
    .catch(err => console.log('err', err))
}

// 获取审核人员
const _fetchManagerMemberByAudit = () => {
  fetchManagerMember({ question_bank_id: id, role_id: 2 })
    .then(res => {
      if (res.code !== 0) {
        return ElMessage.error(res.msg || '获取审核人员失败')
      }
      auditorList.value = res.data || []
    })
    .catch(err => console.log('err', err))
}
// 提交
const submitInfo = () => {
  formRef.value.validate(valid => {
    if (!valid) {
      // 只有基本信息为必填，所有可以直接跳转到第一个tab
      currentStep.value = 1
    } else {
      const { name, area_id, description, audit_policy } = model.value
      const params = { info: { name, area_id, description, audit_policy, id } }
      params.editors = editorList.value || []
      params.auditors = auditorList.value || []
      fetchEditQuestionbank(params)
        .then(res => {
          if (res.code !== 0) {
            return ElMessage.error(res.msg || '编辑题库失败')
          }
          ElMessage.success('保存成功')
          handleClose()
        })
        .catch(err => console.log('err', err))
    }
  })
}
// 向外暴露属性
defineExpose({ handleOpen })
</script>

<style lang="scss" scoped>
.setting__warp {
  position: relative;

  .back-image {
    position: absolute;
    right: 20px;
    top: 14px;
    cursor: pointer;
    z-index: 1;
  }
  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 30px;
      .el-form-item__label {
        color: #333333;
        padding-right: 0;
        margin-bottom: 10px;
      }
      .el-input,
      .el-select {
        width: 100%;
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
      margin-right: 5px;
      color: #da3939;
    }
  }
  :deep(.el-tabs) {
    margin-top: 10px;
    .el-tabs__header {
      padding: 0 20px;
      margin-bottom: 22px;
      border-bottom: 1px solid #d3d3de;
      .el-tabs__active-bar {
        background-color: #0175ff;
        height: 3px;
        width: 16px !important;
      }
      .el-tabs__nav-scroll {
        &::after {
          background-color: #fff;
        }
      }
      .el-tabs__item {
        height: 48px;
        font-size: 16px;
        color: #4d4e54;
        &:hover {
          color: #0175ff;
        }
      }
      .el-tabs__item.is-active {
        color: #0175ff;
      }
    }
    .el-tabs__content {
      padding: 0 20px;
    }
    .el-tab-pane {
      min-height: 390px;
    }
  }
  :deep(.search-box) {
    margin-top: 0;
    margin-bottom: 30px;
  }
  .member__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    label {
      font-weight: 600;
    }
    .member__add-btn {
      display: flex;
      align-items: center;
      height: 20px;
      cursor: pointer;
      span {
        margin-left: 2px;
        color: #0175ff;
      }
      &:hover {
        opacity: 0.85;
      }
    }
  }
  .member__list {
    margin: 10px 0 30px 0;
    flex: 1;
    .member__item {
      display: flex;
      align-items: center;
      margin-bottom: 17px;
      justify-content: space-between;
      &:last-child {
        margin-bottom: 0;
      }
      .el-image {
        width: 32px;
        height: 32px;
        border-radius: 32px;
        margin-right: 12px;
      }
      .member__name {
        flex: 1;
        max-width: 297px;
        margin-right: 12px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }
      .member__del-btn {
        width: 50px;
        height: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        div {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          transform: translateX(30px);
          transition: transform 0.3s;
          cursor: pointer;
          span {
            margin-left: 2px;
            color: #da3939;
          }
          &:hover {
            transform: translateX(0);
          }
        }
      }
    }
  }
  .audit-policy__list {
    margin-top: 10px;
    flex: 1;
    .policy {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      margin-bottom: 20px;
      border: 1px solid #d3d3de;
      border-radius: 2px;
      color: #6a6f7b;
      cursor: pointer;
      transform: all 0.3s;
      &.active,
      &:hover {
        font-weight: 600;
        border-color: #0175ff;
        color: #0175ff;
        background: #eef3fd;
      }
    }
  }
  .submit-btn {
    width: 100%;
    padding: 0 20px;
    margin-top: 10px;
    .el-button {
      border-radius: 2px;
      font-size: 16px;
      height: 42px;
      text-align: right;
      img {
        margin-right: 5px;
      }
    }
  }
}
</style>

<style lang="scss">
.el-drawer__header {
  display: none;
}
.el-drawer__body {
  padding: 0;
}
</style>
