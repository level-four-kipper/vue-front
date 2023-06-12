<template>
  <div class="custom-dialog">
    <el-dialog
      v-model="visible"
      :show-close="false"
      width="680"
      @close="emit('update:dialogVisible', false)"
    >
      <template #header>
        <div class="custom-header">{{ title }}</div>
      </template>
      <div class="custom-body">
        <p>{{ tips }}</p>
        <el-input type="textarea" v-model="inputValue" resize="none"></el-input>
      </div>
      <template #footer>
        <div class="custom-footer">
          <span class="btn--cancel" @click="emit('update:dialogVisible', false)">取消</span>
          <span class="btn--ok" @click="handleConfirm">确认</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: ''
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['handleConfirm', 'update:dialogVisible'])

const visible = ref(false)
const inputValue = ref('')

const handleConfirm = () => {
  emit('handleConfirm', inputValue.value)
}

watchEffect(() => {
  visible.value = props.dialogVisible
  inputValue.value = ''
})
</script>

<style lang="scss" scoped>
.custom-dialog {
  :deep(.el-dialog) {
    background: none;
    .el-dialog__header {
      padding: 0 30px;
      margin: 0;
      background: #0175ff;
      border-radius: 4px 4px 0 0;
      .custom-header {
        display: flex;
        align-items: center;
        height: 54px;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 20px 30px 30px;
      margin: 0;
      background: #fff;
      .custom-body {
        p {
          line-height: 20px;
          margin-bottom: 10px;
          color: #6a6f7b;
        }
        .el-textarea__inner {
          height: 280px;
        }
      }
    }
    .el-dialog__footer {
      padding: 0 30px;
      margin: 0;
      background: #f5f8fe;
      border-radius: 0 0 4px 4px;
      .custom-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 48px;
        .btn--cancel,
        .btn--ok {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 32px;
          font-size: 14px;
          color: #9196a6;
          background: #e4ecfa;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            opacity: 0.85;
          }
        }
        .btn--ok {
          margin-left: 16px;
          color: #fff;
          background: #0175ff;
        }
      }
    }
  }
}
</style>
