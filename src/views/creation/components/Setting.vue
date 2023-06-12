<template>
  <div class="setting">
    <div class="setting-title">
      <div @click="setting">
        <img src="@/assets/img/creation/setting.png" />
        <span>其他设置</span>
      </div>
      <img class="setting-showSetting" src="@/assets/img/creation/showSetting.png" @click="setting" />
    </div>

    <el-form ref="settingFormRef" :model="settingForm" :rules="settingRules" label-width="100%" class="settingForm" label-position="left">
      <el-form-item label="所属领域" prop="type">
        <el-select v-model="settingForm.type" placeholder="请选择所属领域">
          <el-option :value="item.id" :label="item.name" v-for="item in typeOptions" :key="item.id" />
        </el-select>
      </el-form-item>

      <!-- <slot name="blog-type"></slot> -->
      <el-form-item label="博客分类" prop="creation_type" v-if="title=='博客'">
        <el-radio-group v-model="settingForm.creation_type">
          <el-radio label="0" border>原创</el-radio>
          <el-radio label="1" border>转载</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="title+'标签'" prop="list_tags">
        <el-tag v-for="(item, index) in settingForm.list_tags" :key="item" effect="light" size="large">
          {{ item }}
          <img src="@/assets/img/creation/deleteTag.png" @click="deleteTag(index)" class="delete_tag" />
        </el-tag>
        <el-input v-model="tag" placeholder="请输入标签" :disabled="settingForm.list_tags.length >= 5" maxlength="8" @keyup.enter="saveTag">
          <template #suffix>
            <img src="@/assets/img/creation/saveTag.png" v-show="settingForm.list_tags.length < 5" @click="saveTag" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="title+'封面'" prop="image">
        <el-upload class="upload" accept=".jpg,.png,.gif,jpeg" action="/api/file/upload" list-type="picture-card" :headers="token" :show-file-list="false" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-remove="handleRemove" :on-change="uploadChange" :on-error="uploadError">
          <div>
            <img v-if="settingForm.image" :src="settingForm.image" style="width:100%;height:100%" />
            <img v-else src="@/assets/img/creation/upload.png" alt="上传封面" />
            <div v-show="settingForm.image.length==0">上传封面</div>
          </div>
        </el-upload>
        <span class="tips">请上传jpg、jpeg、png、gif类型的图片</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="Setting">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getTypes } from '@/api/creation.js'
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
  settingProp: {
    type: Object,
    default: () => {}
  }
})

const tag = ref('')
const settingForm = reactive({
  list_tags: [],
  creation_type: '',
  type: '',
  tag: '',
  image: ''
})

watch(
  () => props.settingProp,
  newVal => {
    settingForm.type = newVal?.type || ''
    settingForm.image = newVal?.image || ''
    settingForm.creation_type = newVal?.creation_type || ''
    if (newVal?.list_tags?.length) {
      settingForm.list_tags = [...newVal.list_tags]
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const token = ref({ token: localStorage.getItem('tip-web-token') })
const settingFormRef = ref()
const showTagInput = ref(false)
const typeOptions = ref([])
const queryTypes = async id => {
  await getTypes(id)
    .then(res => {
      if (res?.code === 0 && res?.data?.length) {
        typeOptions.value = [...res.data]
      }
    })
    .catch(err => console.log(err))
}

let validateTags = (rules, value, callback) => {
  if (tag.value) {
    const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
    if (tag.value.length < 2 || tag.value.length > 8) {
      callback(new Error('长度必须满足2~8个字符'))
    } else if (!reg.test(tag.value)) {
      callback(new Error(`仅限英文、中文、数字`))
    } else {
      callback()
    }
  } else {
    if (settingForm.list_tags.length <= 0) {
      callback(new Error('请填写并保存标签'))
    } else if (settingForm.list_tags.length > 5) {
      callback(new Error('可以添加的最大标签数量为5'))
    } else {
      callback()
    }
  }

  // if (settingForm.list_tags.length <= 0) {
  //   callback(new Error('请填写并保存标签'));
  // } else if (settingForm.list_tags.length > 5) {
  //   callback(new Error('可以添加的最大标签数量为5'));
  // } else  if(tag.value){
  //     const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  //     if (tag.value.length < 2 || tag.value.length > 8) {
  //       callback(new Error('长度必须满足2~8个字符'));
  //     } else if(!reg.test(tag.value)){
  //       callback(new Error(`仅限英文、中文、数字`));
  //     } else {
  //       callback();
  //     }
  // } else {
  //   callback();
  // }
}

const settingRules = reactive({
  type: [{ required: true, message: '请填写所属领域', trigger: 'change' }],
  creation_type: [{ required: true, message: '请选择博客分类', trigger: 'change' }],
  list_tags: [{ validator: validateTags, trigger: 'change' }]
})

const emit = defineEmits(['setting'])
// 更多配置
const setting = () => {
  emit('setting', false)
}

const addTag = () => {
  showTagInput.value = true
}
const deleteTag = index => {
  settingForm.list_tags.splice(index, 1)
}
const saveTag = () => {
  settingFormRef.value.validateField('list_tags', valid => {
    if (valid && tag.value !== '') {
      settingForm.list_tags.push(tag.value)
      tag.value = ''
    }
  })
}

const uploadSuccess = res => {
  if (res.code !== 0) {
    ElMessage.error(res.msg || res.data.error)
  } else {
    settingForm.image = res.data
  }
}
const uploadChange = res => {
  console.log('uploadChange-------', res)
}
const beforeUpload = file => {
  console.log('beforeUpload-------', file)
  const limit = file.size / 1024 / 1024 < 2
  if (!limit) {
    ElMessage.error('上传的图片大小不能超过2MB')
    return limit
  }
  let type = file?.type
  if (!['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(type)) {
    ElMessage.error('不支持的文件类型，请上传jpg、jpeg、png、gif类型的图片！')
    return type
  }
  return limit || type
}

const uploadError = res => {
  console.log('uploadError-------', res)
}

const validateSettingForm = (titleErr, contentErr) => {
  settingFormRef.value.validate(valid => {
    if (valid && contentErr && titleErr) {
      emit
    }
  })
}
onMounted(async () => {
  await queryTypes()
})
defineExpose({
  tag,
  settingForm,
  settingFormRef,
  validateSettingForm
})
</script>
<style lang="scss" scoped>
.setting {
  top: 0px;
  width: 23%;
  right: 0px;
  font-size: 16px;
  height: calc(100vh - 142px);
  padding: 14px 30px 20px 20px;
  box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  background: #ffffff;
  position: absolute;
  color: #333333;
  overflow: auto;
  .setting-title {
    height: 34px;
    display: flex;
    justify-content: space-between;
    img,
    span {
      vertical-align: middle;
    }
    .setting-showSetting {
      width: 14px;
      height: 14px;
      margin: 11px 0;
    }
  }
  :deep(.el-tag__content) {
    display: flex;
    align-items: center;
  }
  .settingForm {
    margin-top: 12px;
    :deep(.el-form-item) {
      display: block;
      .el-upload--picture-card {
        width: 100%;
        height: 220px;
        background-color: #ffffff;
        overflow: hidden;
      }
      .el-radio-group {
        width: 100%;
        justify-content: space-between;
        .el-radio {
          width: 45%;
          text-align: center;
          margin-right: 10px;
          label.is-checked {
            background-color: #e3e8f1;
          }
          .el-radio__label {
            width: 100%;
          }
          .el-radio__inner {
            display: none;
          }
        }
      }
      .el-tag {
        border: 0px;
        line-height: 30px;
        margin-right: 10px;
        margin-bottom: 10px;
        img {
          vertical-align: middle;
          margin-left: 20px;
        }
      }
      .upload {
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        text-align: center;
        width: 100%;
        &:hover {
          border-color: #409eff;
        }
      }
    }
    .addTag {
      position: absolute;
      right: 0px;
      top: -32px;
    }
    .delete_tag {
      cursor: pointer;
    }
    .tips {
      font-size: 14px;
      color: #9196a6;
    }
  }
}
</style>
