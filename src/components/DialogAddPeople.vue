<template>
  <el-dialog ref="dialog" :model-value="isVisible" title="添加成员" style="width: 30%" @close="onClose">
    <el-form ref="peopleFormRef" :model="formPeopleData" :rules="peopleRules" class="demo-formPeopleData">
      <el-form-item prop="userName" label="输入用户" :label-width="formLabelWidth" :validate-on-rule-change="false">
        <SearchDropInput v-model:value="formPeopleData.userId" v-model:text="formPeopleData.userName" />
      </el-form-item>
      <el-form-item prop="roleId" label="选择角色">
        <el-select v-model="formPeopleData.roleId" placeholder="请选择">
          <el-option v-for="item in roleOption " :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancelForm ">取消</el-button>
        <el-button type="primary" @click="onConfirmForm "> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="DialogAddPeople">
import SearchDropInput from '@/components/SearchDropInput.vue'
import { reactive,onMounted,ref } from 'vue'


const props = defineProps({
  isVisible:Boolean, //弹窗显示
  roleOption:Array,//角色选项列表
  onConfirm:Function, //弹窗确认方法
  peopleRules:Array, //校验规则
})

const peopleFormRef = ref () 
const emit = defineEmits(['update:isVisible','update:data'])
const formPeopleData = reactive({
  userName: '',
  roleId: '',
  age: '',
  userId:'',  
})


const checkAge = (rule , value , callback ) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  } 
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'))
      } else {
        callback()
      }
    }
  
} 
function checkRole(rule , value , callback){ 
  formPeopleData.roleId ? callback():callback(new Error('不能为空'))
}
function checkUser(rule , value , callback) {
    if(!formPeopleData.userName){
      return callback(new Error('不能为空'))
    }else  {
      return formPeopleData.userId ?callback() : callback(new Error('该用户不存在'))
    }

} 
const peopleRules = reactive({ 
  userName: [{  validator: checkUser, trigger: ['blur'] }],
  age: [{ validator: checkAge, trigger: 'blur' }],
  roleId:[{    validator: checkRole, trigger: ['change']}],
})


const onConfirmForm = ( ) => {
  if (!peopleFormRef) return 
    peopleFormRef.value.validate(  (valid, fields) => {
      if(valid) {
        props.onConfirm(formPeopleData)
        emit('update:isVisible', false)
      }else{
        console.log(fields,'fields')
      }
  })

   
}

function onCancelForm(){
  emit('update:isVisible', false)
}                                                                                                 
 const resetForm = ( ) => {
  if (!peopleFormRef.value) return
  peopleFormRef.value.resetFields()
}




  

watch(() => formPeopleData.userId,(newVal) =>{
  if(newVal){
   peopleFormRef.value.clearValidate('userName') //下拉选择模糊搜索用户时，发生失焦事件，无需校验。
  }
})

 

function onClose(){
  emit('update:isVisible', false)

} 


 
</script>
<style scoped lang="scss"></style>
