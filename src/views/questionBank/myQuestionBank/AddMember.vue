<!--添加成员 -->
<template>
  <div>
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
      <el-form-item label="选择用户" prop="selectUser" required="true">
        <el-select v-model="ruleForm.selectUser" placeholder="尚未选择">
          <el-option v-for="(item,index) in selectUserOptions" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择角色" prop="selectRole" required="true">
        <el-select v-model="ruleForm.selectRole" placeholder="尚未选择">
          <el-option v-for="(item,index) in selectRoleOptions" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <div class="addTest-btn">
        <el-button type="primary" @click="goAddTest">添加</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup name="AddMember">
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
// // import { FormInstance, FormRules } from 'element-plus'
// import {  FormRules } from 'element-plus'

const ruleForm = reactive({
  selectUser: [],
  selectRole: []
})
const selectUserOptions = reactive([
  { value: '1', label: '李四' },
  { value: '2', label: '王五' }
])
const selectRoleOptions = reactive([
  { value: '1', label: '出题人' },
  { value: '2', label: '审题人' },
  { value: '3', label: '管理员' }
])
const router = useRouter()
//添加成员
const goAddTest = () => {
  router.push({ name: 'clickQuestionBank' })
}
//取消添加成员
const cancel = () => {
  router.push({ name: 'clickQuestionBank' })
}
</script>
<style lang="scss" scoped>
</style>
