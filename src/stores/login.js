import { defineStore } from 'pinia'
import router from '../router/index.js'
import { fetchLogin, fetchPublicKey } from '@/api/login.js'
import { fetchUserDetail } from '@/api/authorSpace.js'
import { fetchWebInfo } from '@/api/broswer.js'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { getBrowserInfo } from '@/utils/utils'

export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      name: localStorage.getItem('tip-web-name') || '',
      number: localStorage.getItem('tip-web-number') || '',
      email: localStorage.getItem('tip-web-email') || '',
      role: localStorage.getItem('tip-web-role') || '0', //字符串 0普通用户，1管理员
      token: localStorage.getItem('tip-web-token') || '',
      id: localStorage.getItem('tip-web-user-id') || '',
      avatar: localStorage.getItem('tip-web-avatar') || '',
      username: localStorage.getItem('tip-web-username') || '',
      publicKey: localStorage.getItem('tip-web-publicKey') || '',
      curRoute: '',
      axiosSource: null,
      errorFlag: false
    }
  },
  getters: {},
  actions: {
    // 获取公钥
    getPublicKey() {
      fetchPublicKey().then(res => {
        if (res.code !== 0) {
          ElMessage({ showClose: true, message: res.msg, type: 'warning' })
          return
        }
        this.publicKey = res.data
        localStorage.setItem('tip-web-publicKey', res.data)
      })
    },
    // 统一请求，默认路由改变时才修改
    setCancelToken() {
      const CancelToken = axios.CancelToken
      this.axiosSource = CancelToken.source()
    },
    // 中断请求
    handleAxiosCancel() {
      this.axiosSource.cancel()
    },
    // 退出
    loginOut() {
      localStorage.clear()
      this.$reset()
      router.replace('/login')
    },
    // 登录
    loginIn(params) {
      fetchLogin(params).then(res => {
        if (res.code !== 0) {
          ElMessage({
            showClose: true,
            message: res.msg,
            type: 'warning'
          })
          return
        }

        this.role = res.data.role
        this.token = res.data.token
        this.id = res.data.id
        this.email = params.email
        localStorage.setItem('tip-web-email', params.email)
        localStorage.setItem('tip-web-role', res.data.role + '')
        localStorage.setItem('tip-web-token', res.data.token)
        localStorage.setItem('tip-web-user-id', res.data.id)

        this.getUserInfo().then(() => {
          if (this.curRoute) {
            router.replace(this.curRoute)
          } else {
            router.replace('/home')
          }
        })

        this._fetchWebInfo()

        this.curRoute = ''
      })
    },
    // 记录路由
    setCurRoute() {
      const curRoute = router.currentRoute.value
      if (curRoute.meta.noToken) {
        this.curRoute = ''
      } else {
        this.curRoute = curRoute.fullPath
      }
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        fetchUserDetail(this.id).then(res => {
          if (res.code === 0) {
            this.username = res.data.username
            this.avatar = res.data.img_url
            this.name = res.data.name
            this.number = res.data.employee_number
            localStorage.setItem('tip-web-username', res.data.username)
            localStorage.setItem('tip-web-avatar', res.data.img_url)
            localStorage.setItem('tip-web-name', res.data.name)
            localStorage.setItem('tip-web-number', res.data.employee_number)
            resolve(res.data)
          }
          reject()
        })
      })
    },
    setErrorFlag(flag) {
      this.errorFlag = flag
    },
    // 上报浏览器信息
    _fetchWebInfo() {
      const { name, version } = getBrowserInfo()
      const { availWidth, availHeight } = window.screen
      const params = {
        edition: version, // 浏览器版本
        model: name, // 浏览器型号
        resolution: `${availWidth}*${availHeight}` // 分辨率
      }

      fetchWebInfo(params)
    }
  }
})
