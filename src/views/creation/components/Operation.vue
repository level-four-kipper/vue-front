<template>
  <div :class="['operation', !showSetting ? 'padding': '']">
    <div>
      <el-button class="publish" type="primary" @click="publish"><img src="@/assets/img/creation/publish.png" />发布{{ title }}</el-button>
      <slot name="auto-save"></slot>
      <el-button @click="saveDraft" v-if="showDraft"><img src="@/assets/img/creation/saveDraft.png" />保存草稿</el-button>
      <el-button @click="preview"><img src="@/assets/img/creation/preview.png" />预览{{ title }}</el-button>
      <el-divider direction="vertical" />
      <el-button @click="back">退出</el-button>
    </div>
    <div>
      <el-button @click="setting">
        <img src="@/assets/img/creation/setting.png" />
        <span>其他设置</span>
        <img src="@/assets/img/creation/showSetting.png" />
      </el-button>
    </div>
  </div>
</template>

<script setup name="Operation">
import { ref, onMounted, computed, watch } from 'vue';
import { ElMessage } from 'element-plus'

const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
  operation: {
    type: String,
    default: () => '发布博客'
  },
  showSettings: {
    type: Boolean,
    default: () => false
  },
  showDrafts: {
    type: Boolean,
    default: () => false
  },
})

const showSetting = ref(props.showSettings)
const showDraft = ref(props.showDrafts)
watch(
  ()=> props.showSettings,
  (newVal) => {
    showSetting.value = newVal;
  }
)
watch(
  () => props.showDrafts,
  (newVal) => {
    showDraft.value = newVal
  }
)
const emit = defineEmits( ['publish', 'saveDraft', 'preview', 'setting', 'back'] )
// 更多配置
const publish = () => {
  emit('publish')
}

// 保存草稿
const saveDraft = () => {
  emit('saveDraft')
}
// 更多配置
const setting = () => {
  showSetting.value = true;
  emit('setting', true)
}
const router = useRouter()
const back = () => {
  emit('back')
}

const preview = () => {
  emit('preview', true)
}

onMounted( async ()=>{
})
defineExpose({
})
</script>

<style lang="scss" scoped>
.operation {
  height: 64px;
  padding: 0 30px;
  line-height: 64px;
  justify-content: space-between;
  background-color: #ffffff;
  display: flex;
  :deep(.el-button){
    border: 0px;
    margin-right: 2px;
    span{
      margin-right: 5px;
    }
  }
  .publish{
    background: #0175FF;
    img{
      margin-right: 5px;
    }
  }
  .border{
    height: 25px;
    display: inline-block;
    border-right: 2px solid #9196A6;
    vertical-align: middle;
  }
}
.padding{
  padding: 0 13%;
}
</style>
