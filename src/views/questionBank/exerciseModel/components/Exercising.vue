<template>
  <div class="exercising" ref="exercising">
    <div class="subject" >
      <el-button-group>
        <el-button >{{ index || 1 }}</el-button>
        <el-button >{{ type || '选择题'}}</el-button>
      </el-button-group>

      <div class="title"> {{ title || '关于Java程序的main()方法的说法中，错误的是' }}</div>

      <answer>

      </answer>

      <Solution>

      </Solution>

    </div>
    <div class="statistics">
      <div class="time">
        <div class="statistics-title">
          <img src="@/assets/img/questionBank/clock.png" alt="用时" />
          <span class="congratulation">刷题用时</span>
        </div>
        <div>
          <span class="total">145</span>
          <span class="unit">min</span>
        </div>
      </div>

      <div class="rank">
        <div class="statistics-title">
          <img src="@/assets/img/questionBank/rank.png" alt="实时排名" />
          <span class="">实时排名</span>
        </div>
        <div >
          <span class="total">145</span>
          <span class="unit">名</span>
        </div>
        <div>
          <div class="rank-item rank-detail">
            <div> 39  </div>
            <div> 87% </div>
          </div>
          <div class="rank-pictures">
            <div> <span class="total-picture"> </span> </div>
            <div> <span class="rank-pic"> </span> </div>
          </div>
          <div class="rank-item rank-title">
            <div> 刷题数量 </div>
            <div> 正确率 </div>
          </div>
        </div>
      </div>
      
      <div class="action">
        <div :class="[disabled ? 'disabled' :'']" @click="confirm">确定</div>
        <div :class="[!disabled ? 'disabled' :'']" @click="next">下一题</div>
      </div>

    </div>

  </div>
</template>

<script setup name="Exercising">
import { ref, onMounted, } from 'vue';
import Solution from './Solution.vue'

const disabled = ref(false)
const exercising = ref('exercising')
const emit = defineEmits( ['start', 'startLastTime'] )
// 直接开始
const start = () => {
  emit('start')
}
// 继续上一次
const startLastTime = () => {
  emit('startLastTime')
}

const confirm = () => {
  disabled.value = true
}

const next = () => {
  disabled.value = false
}
onMounted( async ()=>{
})
</script>
<style lang="scss" scoped>
.exercising {
  color: #535560;
  display: flex;
  margin: 20px;
  width: 1200px;
  .subject{
    background-color: #ffffff;
    width: 880px;
    height: 600px;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 28px;
    background: #FFFFFF;
    box-shadow: 0 2px 16px 0 rgba(156,172,209,0.30);
    border-radius: 4px;
    padding: 30px;
    
    :deep(.el-button){
      cursor: pointer;
      border-color: #0175FF;
      color: #0175FF;
    }

    .title{
      margin-top: 28px;
      color: #333333;
      font-size: 18px;
    }

    .footer{
      bottom:30px;
      border-radius: 4px;
      background: #EEF3FD;
      line-height: 110px;
      font-size: 16px;
      height: 110px;
      left: 2.5%;
      width: 95%;
      position: absolute;
      text-align: center;
    }
  }

  .statistics{
    height: 600px;
    margin-left: 20px;
    text-align: center;
    color: #333333;
    width: 300px;
    img{
      height: 36px;
      width: 36px;
    }
    .statistics-title{
      display: flex;
      font-size: 16px;
      line-height: 36px;
      margin-bottom: 5px;
      justify-content: center;
    }
    .total{
      font-size: 28px;
      font-weight: 600;
      height: 32px;
    }
    .unit{
      font-size: 14px;
      margin-left: 5px;
    }
    .time{
      height: 128px;
      background: #FFFFFF;
      border-radius: 4px;
      padding: 24px 32.3%;
    }
    .rank{
      height: 278px;
      background: #FFFFFF;
      border-radius: 4px;
      padding-top: 30px;
      margin-top: 20px;      
      .rank-item{        
        div{
          width: 50%;
          display: inline-flex;
          justify-content: center;
          text-align: center;
          flex: 1;
        }
        
      }
      .rank-detail{
        color: #333333;
        font-size: 18px;
        font-weight: 600;
        margin-top: 55px;
      }
      .rank-pictures{
        height: 5px;
        text-align: center;
        display: flex;
        margin: 3px 0px 6px 0;
        div{
          width: 50%;
          display: flex;
          justify-content: center;
          text-align: center;
          flex: 1;
        }
        .total-picture{
          width: 20px;
          height: 3px;
          background: #0175FF;
          background-image: linear-gradient(133deg, #6DC8FF 0%, #4399FF 100%);
        }
        .rank-pic{
          width: 20px;
          height: 3px;
          background: #D8D8D8;
          background-image: linear-gradient(-42deg, #39DECD 0%, #33E09F 100%);
        }
      }
      .rank-title{
        color: #535560;
        font-size: 14px;
      }
    }
    .action{
      margin-top: 60px;
      div{
        color: #FFFFFF;
        background: #0175FF;
        border-radius: 4px;
        line-height: 42px;
        margin-top: 30px;
        font-size: 16px;
        height: 42px;        
        text-align: center;
      }
      .disabled{
        opacity: 0.3;
      }
    }

  } 
  
}
</style>
