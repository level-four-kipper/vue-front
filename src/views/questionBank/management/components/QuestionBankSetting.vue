<template>
  <el-form ref="ruleFormRef" :model="question_bank_dto" :rules="rules" label-position="top">
    <el-tabs v-model="activeSetting" stretch>
      <el-tab-pane label="基本设置" name="setting">
        <el-form-item prop="name" label="题库名称">
          <el-input v-model="question_bank_dto.name" placeholder="名称不超过15个字符" maxlength="15" clearable :disabled="!!roleId" />
        </el-form-item>
        <el-form-item prop="area_id" label="所属领域">
          <el-select ref="areaSelector" v-model="question_bank_dto.area_id" :disabled="!!roleId" filterable placeholder="请选择所属领域">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="题库介绍">
          <el-input
            v-model="question_bank_dto.description"
            type="textarea"
            rows="5"
            resize="none"
            placeholder="请输入题库介绍"
            :disabled="!!roleId" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="编辑设置" name="edit">
        <el-form-item>
          <SearchBox v-model:keyword="searchVal" placeholder="搜索成员" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="custom-label">
              <label>编辑成员</label>
              <div v-if="!roleId" class="btn--add" @click="dialogVisible = true">
                <img src="@/assets/img/createQuestionBank/add2.png" alt />
                <span>添加</span>
              </div>
            </div>
          </template>
          <template #default>
            <div class="member-list">
              <template v-for="(item, index) in bank_editor_list" :key="index">
                <div v-if="item.show" class="member">
                  <el-image :src="item.img_url" />
                  <div class="member__name">{{ item.username }}</div>
                  <div v-if="!roleId" class="member__btn--del" @click="handleDelete(index)">
                    <div>
                      <img src="@/assets/img/createQuestionBank/del.png" alt />
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="审核设置" name="audit">
        <el-form-item>
          <SearchBox v-model:keyword="searchVal" placeholder="搜索成员" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="custom-label">
              <label>审核成员</label>
              <div v-if="!roleId" class="btn--add" @click="dialogVisible = true">
                <img src="@/assets/img/createQuestionBank/add2.png" alt />
                <span>添加</span>
              </div>
            </div>
          </template>
          <template #default>
            <div class="member-list">
              <template v-for="(item, index) in bank_auditor_list" :key="index">
                <div v-if="item.show" class="member">
                  <el-image :src="item.img_url" />
                  <div class="member__name">{{ item.username }}</div>
                  <div v-if="!roleId" class="member__btn--del" @click="handleDelete(index)">
                    <div>
                      <img src="@/assets/img/createQuestionBank/del.png" alt />
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="审核策略">
          <div class="policy-list" @click="handlePolicyClick">
            <div
              v-for="item in auditPolicyList"
              :key="item.value"
              :class="{ policy: true, active: item.value === question_bank_dto.audit_policy }"
              :data-value="item.value">
              {{ item.label }}
            </div>
          </div>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </el-form>
  <!-- 添加成员弹窗 -->
  <CustomDialog
    v-model:dialogVisible="dialogVisible"
    :title="`添加${activeSetting === 'edit' ? '编辑' : '审核'}成员`"
    tips="请输入对方的邮箱地址，每行一个，每次最多输入10个"
    @handleConfirm="handleConfirmAdd" />
</template>

<script setup>
import SearchBox from './SearchBox.vue'
import CustomDialog from './CustomDialog.vue'
import { ElMessage } from 'element-plus'

import { fetchTypeList, fetchMemberInfo, fetchManagerMember } from '@/api/questionBank.js'
import useQuestionbank from '@/hooks/useQuestionbank'
import _ from 'lodash'

const { question_bank_dto, bank_editor_list, bank_auditor_list } = inject('questionBank')
const { auditorList, editorList } = inject('originalBankConfig')
const { bankId, auditPolicyList } = useQuestionbank()

const ruleFormRef = ref(null)
const activeSetting = ref('setting')
const roleId = computed(() => {
  return question_bank_dto.role_id || 0
})

const rules = reactive({
  name: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
  area_id: [{ required: true, message: '请选择所属领域', trigger: 'blur' }],
})
const areaOptions = ref([])

const searchVal = ref('')
const dialogVisible = ref(false)
const emailReg = /^[a-zA-Z]+\.+[a-zA-Z\d]+\@(byd)\.(com)$/
const areaSelector = ref(null)

// 查询领域
const _fetchTypeList = () => {
  fetchTypeList().then(res => {
    if (res.code === 0) {
      areaOptions.value = res.data || []
    }
  })
}

// 改变审核策略
const handlePolicyClick = e => {
  if (roleId.value !== 0) return
  question_bank_dto.audit_policy = +e.target.dataset.value
}

// 添加成员：确认
const handleConfirmAdd = emailString => {
  const arr = emailString.split('\n')
  const errorEmail = []

  arr.forEach(item => {
    const email = item.trim()
    if (email && !emailReg.test(email)) {
      errorEmail.push(email)
    }
  })

  if (errorEmail.length > 0) {
    ElMessage({
      message: `邮箱格式错误：${errorEmail.join(',')}`,
      type: 'warning',
    })
    return
  }

  dialogVisible.value = false

  if (emailString === '') return

  fetchMemberInfo(arr.join(',')).then(res => {
    if (res.code !== 0) {
      const msg = res.msg.replace(/\\n/g, '<br/>')
      ElMessage({
        dangerouslyUseHTMLString: true,
        message: msg,
        type: 'warning',
      })
      return
    }

    const list = res.data.bank_manage_volist.map(item => {
      const { img_url, user_id, username } = item
      return {
        question_bank_id: bankId.value,
        img_url,
        user_id,
        username,
        show: true,
        role_id: activeSetting.value === 'edit' ? 1 : 2,
      }
    })

    if (activeSetting.value === 'edit') {
      // 去重，删除原列表，push新列表
      const arr = new Set([...bank_editor_list, ...list])
      bank_editor_list.splice(0)
      arr.forEach(item => {
        item.show = true
        bank_editor_list.push(item)
      })
    } else {
      const arr = new Set([...bank_auditor_list, ...list])
      bank_auditor_list.splice(0)
      arr.forEach(item => {
        item.show = true
        bank_auditor_list.push(item)
      })
    }
  })
}

// 获取编辑人员
const _fetchManagerMemberByEdit = () => {
  const params = { question_bank_id: bankId.value, role_id: 1 }
  fetchManagerMember(params).then(res => {
    if (res.code === 0) {
      bank_editor_list.splice(0)
      res.data?.forEach(item => {
        item.show = true
        bank_editor_list.push(item)
      })
      editorList.value = _.cloneDeep(bank_editor_list)
    }
  })
}

// 获取审核人员
const _fetchManagerMemberByAudit = () => {
  const params = { question_bank_id: bankId.value, role_id: 2 }
  fetchManagerMember(params).then(res => {
    if (res.code === 0) {
      bank_auditor_list.splice(0)
      res.data.forEach(item => {
        item.show = true
        bank_auditor_list.push(item)
      })
      auditorList.value = _.cloneDeep(bank_auditor_list)
    }
  })
}

// 搜索成员
const searchMember = () => {
  if (!searchVal.value) {
    bank_editor_list.forEach(item => {
      item.show = true
    })
    bank_auditor_list.forEach(item => {
      item.show = true
    })
    return
  }

  if (activeSetting.value === 'edit') {
    bank_editor_list.forEach(item => {
      item.show = false
      if (item.username.includes(searchVal.value)) {
        item.show = true
      }
    })
  } else {
    bank_auditor_list.forEach(item => {
      item.show = false
      if (item.username.includes(searchVal.value)) {
        item.show = true
      }
    })
  }
}

watch(
  () => searchVal.value,
  () => {
    searchMember()
  },
)

// 删除成员
const handleDelete = index => {
  if (activeSetting.value === 'edit') {
    bank_editor_list.splice(index, 1)
  } else {
    bank_auditor_list.splice(index, 1)
  }
}

onMounted(() => {
  _fetchTypeList()
  _fetchManagerMemberByEdit()
  _fetchManagerMemberByAudit()
})

document.addEventListener('visibilitychange', function () {
  let pageVisibility = document.visibilityState
  // 页面变为不可见时触发，领域选择器失焦
  if (pageVisibility == 'hidden') {
    areaSelector.value.blur()
  }
})
</script>

<style lang="scss" scoped>
.el-form-item__content {
  color: #4d4e54;
}
:deep(.el-form-item) {
  padding: 0 20px;
  margin-top: 30px;
  .el-form-item__label {
    line-height: 20px !important;
    padding: 0;
    margin-bottom: 10px !important;
    height: 20px;
    font-weight: 600;
    color: #333;
  }
  .el-form-item__content {
    line-height: normal;
  }
  .el-input__inner {
    height: 36px;
    line-height: 36px;
  }
  .el-select {
    width: 100%;
  }
}
.custom-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  label {
    font-weight: 600;
  }
  .btn--add {
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

.member-list {
  flex: 1;
  .member {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    &:last-child {
      margin-bottom: 0;
    }
    .el-image {
      width: 32px;
      height: 32px;
      border-radius: 32px;
      margin-right: 12px;
    }
    &__name {
      flex: 1;
      max-width: 216px;
      margin-right: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }
    &__btn--del {
      width: 48px;
      height: 20px;
      overflow: hidden;
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

.policy-list {
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
:deep(.el-tabs__content) {
  height: calc(100vh - 193px);
  overflow-y: auto;
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.3);
  }

  &::-webkit-scrollbar-track {
    background: #f6f6f6;
  }

  &::-webkit-scrollbar-track-piece {
    background-color: transparent;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:vertical {
    height: 12px;
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:vertical {
    height: 12px;
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:vertical:hover,
  &::-webkit-scrollbar-thumb:horizontal:hover {
    background-color: rgba(144, 147, 153, 0.5);
  }
}
</style>
