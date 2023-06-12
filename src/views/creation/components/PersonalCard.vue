<template>
  <div class="personal">
    <img class="avatar" :src="avatar" alt="头像" />
    <div class="name">{{username}}</div>
    <div class="dept">{{intro}}</div>
  </div>
</template>

<script setup name="Setting">
import { useLoginStore } from '@/stores/login.js'

const loginStore = useLoginStore()

const { avatar, username } = storeToRefs(loginStore)
const intro = ref('')

onMounted(() => {
  loginStore.getUserInfo().then(data => {
    intro.value = data.intro || 'TA还没想好写什么...'
  })
})
</script>
<style lang="scss" scoped>
.personal {
  width: 260px;
  height: 160px;
  padding: 21px 33px 15px 33px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: #ffffff;
  text-align: center;
  .avatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
  }
  .name {
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    margin: 16px 0px 6px 0;
  }
  .dept {
    color: #6d717d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }
}
</style>
