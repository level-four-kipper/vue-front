<template>
    <div>
        <div class="nav-bread">
            <NavBread :lists="lists"></NavBread>
        </div>
        <div>
            <div class="title"><span>注册信息</span></div>
        </div>
        <div class="information">
            <p>
                <label>姓名</label>
                <span>{{information.name}}</span>
            </p>
            <p>
                <label>工号</label> <span> {{information.employee_number}}</span>
            </p>
            <p>
                <label>邮箱</label> <span>{{information.email}}</span>
            </p>
            <p>
                <label>部门</label> <span>{{information.department}}</span>
            </p>
            <p>
                <label>岗位</label> <span>{{information.post}}</span>
            </p>
        </div>
        <div>
          <button class="pass" @click="pass">通过</button>
          <button class="reject" @click="reject">拒绝</button>
        </div>
    </div>
</template>

<script setup >
 import NavBread from "@/components/NavBread.vue";
  import {onMounted, ref, reactive} from 'vue'
  import {useRouter} from 'vue-router'
  import {fetchAuditInformation ,fetchAudit} from '@/api/controlPannel.js'
  import { ElMessage } from 'element-plus'
 let lists=ref([])
 lists=[{name:'安全',path:'/controlPanel'},
        {name:'注册审核',path:'/controlPanel/registrationAudit'},
        {name:'审核信息',path:''}]

let information=ref({})
 //路由传参
 const router=useRouter()
 const userId=router.currentRoute.value.params.id
 onMounted(()=>{
  const data=fetchAuditInformation(userId)
    data.then(result=>{
      if(result.code===0){
          information.value=result.data
      }else{
          ElMessage({
            showClose: true,
            message: '请稍后再试',
            duration:5000
          })
      }
    })
 })
function pass(){
  fetchAudit({ audit_status: 1,
              id:userId}).then(result=>{
                console.log(userId,'userId')
                console.log(result,'result')
                if(result.code===0){
                router.push('/controlPanel/registrationAudit')
                }else{
                  ElMessage({
                    showClose: true,
                    message: '请稍后再试',
                    duration:5000
                  })
                }
              })
}
function reject(){
  fetchAudit({ audit_status: 2,
              id:userId}).then(result=>{
                console.log(userId,'userId')
                console.log(result,'result')
                if(result.code===0){
                router.push('/controlPanel/registrationAudit')
                }else{
                  ElMessage({
                    showClose: true,
                    message: '请稍后再试',
                    duration:5000
                  })
                }
              })
}
</script>

<style scoped lang="scss">
.el-menu {
  border-right: unset !important;
}
.nav-bread{
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(226, 223, 223);
}
.title{
  height: 30px;
  width: 70px;
  border:1px solid rgb(226, 223, 223);
  color: rgb(189, 184, 184);
  font-size:12px;
  margin-top:20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.information{
  margin:25px 0;
  font-family: 'Arial Normal', 'Arial', sans-serif;
  p{
    margin-bottom:15px;
    label{
      color: rgb(126, 126, 126);
      font-size: 12px;
      margin-right: 10px;
    }
    span{
      font-size:12px
    }
  }
}
.pass{
  border-style: none;
  background-color: #0066FFFC;
  color: white;
  font-size:12px;
  width: 44px;
  height: 30px;
  margin-right:30px;
  cursor: pointer;
}
.reject{
  border-style: none;
  color:#0066FFFC;
  font-size:12px;
  width: 44px;
  height: 30px;
  background-color: white;
  cursor: pointer;
}
</style>
