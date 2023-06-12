<template>
  <div class="solution" ref="solution">
    <div class="correct" v-if="result==true">
      回答正确
    </div>
    <div class="wrong" v-else >
      <div class="" >
        回答错误
      </div>
      <div class="correct-answer" >
        正确答案：{{answer}}
      </div>
    </div>
    

  </div>
</template>

<script setup name="Solution">

const props = defineProps({
  result: {
    type: Boolean,
    default: () => true
  },
  answer: {
    type: String,
    default: () => ''
  },
})

</script>
<style lang="scss" scoped>
.solution {
  background: #EEF3FD;
  border-radius: 4px;
  bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  padding-left: 20px;
  position: absolute;
  width: 820px;
  .correct{
    color: #0CBB7A;
    line-height: 65px;
    height: 65px;
  }
  .wrong{
    height: 110px;
    color: #EB533B;
    div {
      height: 25px;
      padding: 20px 0;
    }
    .correct-answer {
      color: #333333;
    }
  }  
}
</style>
