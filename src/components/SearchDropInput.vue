<script setup name="SearchDropInput">
import {ref,watch,defineEmits} from 'vue'
import { fetchSearchUserList,  } from '@/api/userManage.js'
import { ElMessage } from 'element-plus'
import _ from 'lodash'

const props = defineProps({
    text:String, //输入的文字内容
    value:String, // 模糊搜索的选中item的value
})

const emit = defineEmits(['update:value','update:text'])
const inputValue = ref('')
const isShow = ref(true)
const userList = ref([])

watch(inputValue,(newVal)=>{
  emit('update:text',newVal)
})

function onKeyUp() {
  isShow.value = true
  getUserList(inputValue.value)

}

function changeOption(item) {
  emit('update:value', item.value)
   inputValue.value = item.label
   isShow.value = false 
}
// 模糊搜索用户
const  getUserList =_.debounce((keyName) => {
  fetchSearchUserList(keyName || null).then(res =>{
      if(res.code ===  0 ){
      userList.value =  res.data? res.data.map(item => { return {label: item.name,value:item.id}}) :[]
      } 
    })
},300)
</script>

<template>
  <div class="search-drop-input" :class="{'is-drop':userList.length > 0 && isShow}">
    <el-input class="search-input" type="text" clearable v-model.trim="inputValue" autocomplete="off" @keyup="onKeyUp" />
    <div v-if="userList.length > 0 && isShow" class="select-item-list">
      <option v-for="(item ,index) in userList " :key="index" :label="item.label" :value="item.value" @click="changeOption(item )" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-drop-input {
  width: 214px;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  &.is-drop {
    border-radius: 4px 4px 0 0;
  }
  :deep(.el-input__wrapper) {
    box-shadow: none;
  }
  .select-item-list {
    border: 1px solid #dcdfe6;
    border-top: 0;
    border-radius: 0 0 4px 4px;
    position: absolute;
    z-index: 100;
    background-color: #fff;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    border-top: 1px solid #dcdfe6;
    option {
      cursor: pointer;
      &:hover {
        background-color: #ccc;
      }
    }
  }
}
</style>
