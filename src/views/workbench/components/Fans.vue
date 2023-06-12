<template>
  <div class="fans">
    <div class="header">
      <h2>
        <span>我的粉丝</span>
        <el-input v-model="key" class="w-50 m-2" placeholder="输入关键字搜索" :suffix-icon="Search" />
      </h2>
    </div>

    <div>
      <div>
        <div class="card">
          <div class="card-title">
            当前总数
            <img src="@/assets/img/workbench/currentTotal.png" @click="deleteTag(index)" />
          </div>
          <div class="card-number">33333</div>
          <div class="card-bottom card-bottom-total"></div>
        </div>
        <div class="card">
          <div class="card-title">
            今日新增
            <img src="@/assets/img/workbench/todayAdd.png" @click="deleteTag(index)" />
          </div>
          <div class="card-number">111</div>
          <div class="card-bottom card-bottom-today"></div>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script setup name="Setting">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
})

const key = ref(0)
const activeIndex = ref(0)
const handleSelect = (value) => {
  activeIndex.value = value
}

onMounted(async () => {
})
defineExpose({
})
</script>
<style lang="scss" scoped>
.fans {
  .header{
    background-color: #ffffff;
    border-radius: 4px;
    line-height: 54px;
    padding: 0 20px;
    h2{
      display: flex;
      align-items: center;
      justify-content: space-between;
      :deep(.el-input){
        height: 36px;
        width: 220px;
        .el-input__wrapper{
          background: #EEF3FD;
          border-radius: 18px;
          .i{
            color: #0175FF;
            font-size: 18px;
          }
        }
      }
    }
  }
  .card{
    background-color:#fff;
    height: 132px;
    width: 200px;
    padding: 20px;
    margin: 20px 20px 0 0;
    .card-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-number{
      color: #333333;
      font-size: 28px;
      margin-top: 5px;
      line-height: 40px;
      height: 40px;
    }
    .card-bottom {
      height: 4px;
      margin-top: 10px;
      width: 30px;
    }
    .card-bottom-total{
      background: #0175FF;
      background-image: linear-gradient(133deg, #6DC8FF 0%, #4399FF 100%);
    }
    .card-bottom-today{
      background: #D8D8D8;
      background-image: linear-gradient(-42deg, #39DECD 0%, #33E09F 100%);
    }
  }
}
</style>
