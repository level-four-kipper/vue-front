<template>
    <div class="page">
        <Header />
        <Question />
    </div>
</template>
<script setup name="Questionnaire">
import Header from './components/Header.vue'
import Question from './components/Question.vue'

document.title = '用户调查表'
</script>
<style lang="scss" scoped>
.page {
    padding: 0 0 20px;
    font-size: 14px;
    color: #333;
    background: #f2f2f2;
}
</style>