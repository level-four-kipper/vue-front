<template>
  <div class="time">
    <div class="statistics-title">
      <img src="@/assets/img/questionBank/clock.png" alt="用时" />
      <span class="congratulation">刷题用时</span>
    </div>
    <div>
      <span class="total">{{statistic?.timer || 0}}</span>
      <span class="unit">min</span>
    </div>
  </div>

  <div class="rank">
    <div class="statistics-title">
      <img src="@/assets/img/questionBank/rank.png" alt="实时排名" />
      <span class="">实时排名</span>
    </div>
    <div >
      <span class="total">{{statistic?.ranking || ''}}</span>
      <span class="unit">名</span>
    </div>
    <div>
      <div class="rank-item rank-detail">
        <div> {{ statistic?.count || 0 }}  </div>
        <div> {{ statistic?.accuracy || '0%' }} </div>
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
</template>

<script setup name="Statistics">

const props = defineProps( {
  statistic: {
    type: Object,
    default: () => { }
  }
})

onMounted( async ()=>{
})
</script>
<style lang="scss" scoped>
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
</style>