<template>
  <div class="type-box">
    <div class="type" v-for="(item, index) in typeList" :key="index">
      <div class="type__title">{{ item.title }}</div>
      <div class="type__list">
        <span
          class="type__list__cell"
          v-for="subItem in item.items"
          :key="subItem.value"
          @click.stop="emit('handleTypeClick', { type: subItem.value })"
        >{{ subItem.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['handleTypeClick'])
// 题型
const typeList = [
  {
    title: '选择题',
    items: [
      {
        label: '单选题',
        value: 0
      },
      {
        label: '多选题',
        value: 1
      }
    ]
  },
  {
    title: '问答题',
    items: [
      {
        label: '简答题',
        value: 2
      },
      {
        label: '编程题',
        value: 3
      }
    ]
  }
]
</script>

<style lang="scss" scoped>
.type-box {
  margin-top: 30px;
  padding: 0 20px;
  font-size: 14px;
  color: #333;
  .type {
    margin-bottom: 30px;
    &__title {
      margin-bottom: 10px;
      line-height: 20px;
      font-weight: 600;
    }
    &__list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__cell {
        width: 150px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #d3d3de;
        border-radius: 2px;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          font-weight: 600;
          border-color: #0175ff;
          color: #0175ff;
          background: #eef3fd;
        }
      }
    }
  }
}
</style>
