<template>
  <div class="header">
    <div class="qs-header">
      <span class="qs-index"># {{question.question_number}}</span>
      <span class="qs-type">{{question.type}}</span>
      <span class="qs-title">{{question.question_issue}}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps ({
    question:Object
})
</script>

<style scoped lang="scss">
.qs-header{
    width:1000px;
    height: 70px;
    display:flex;
    align-items: center;
    border-bottom :1px solid #dedede;
    padding: 0 30px;
    background-color: #fff;
    font-size: 12px;
    // width: 800px;
    .qs-index{
        width:30px;
        height: 30px;
        color:#0066FFFC;
        border:solid 1px #0066FFFC;
        text-align: center;
        line-height: 28px;
    }
    .qs-type{
        width:56px;
        height: 30px;
        line-height: 28px;
        color:#0066FFFC;
        border:solid 1px #0066FFFC;
        border-left:none;
        text-align: center;
        margin-right: 30px;
    }
}
</style>
