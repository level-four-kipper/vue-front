<template>
  <iframe ref='iframe' @load="onLoad" style="width: 100vw; height:100vh" src="http://prm.byd.com.cn:8888/swb/login.do?method=getAuthCode&client_id=fdkj_fdtech&redirect_uri=http://10.8.5.53:15778/index&dateTime=1669558348780" frameborder="0"></iframe>
</template>

<script setup>
const router = useRouter()
const iframe = ref(null)
const loadTime = ref(0)
const onLoad = e => {
  loadTime.value++
  if (loadTime.value > 1) {
    window.open('http://prm.byd.com.cn:8888/swb/login.do?method=getAuthCode&client_id=fdkj_fdtech&redirect_uri=http://10.8.5.53:15778/index&dateTime=1669558348780', '_blank')
  }
}

onMounted(() => {
  // console.log(iframe.value.src)
})
</script>

