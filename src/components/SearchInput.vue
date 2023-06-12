<script setup>
defineProps({
  placeholder: { type: String, default: '输入关键字搜索' },
  modelValue: { type: String, default: '' }
})
const emit = (['update:modelValue'])
const textValue = ref('')
watch(textValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <div class="search">
    <input type="text" :placeholder="placeholder" v-model="textValue" />
    <img src="@/assets/img/index/g-search.png" />
  </div>
</template>

<style scoped lang="scss">
.search {
  display: flex;
  width: 220px;
  padding: 0 16px;
  align-items: center;
  color: #9196a6;
  background: #eef3fd;
  border-radius: 18px;
  height: 36px;
  input {
    min-width: 0;
    font-weight: 400;
    flex: 1 1 auto;
    background: #eef3fd;
    border: none;
    outline: none;
    &::placeholder {
      color: #9196a6;
    }
  }
  img {
    width: 16px;
    height: 16px;
    margin-left: 10px;
  }
}
</style>
