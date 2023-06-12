<template>
  <div class="">
    <div>ddddddd</div>
    <div></div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeKey = ref('')

watch(
  () => route?.fullPath,
  newVal => {
    routeKey.value = newVal
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss"></style>
