/* eslint-disable no-undef */
import axios from 'axios'
import { isPlainObject } from 'lodash'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/stores/login.js'
const service = axios.create({
  // 公共接口
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时时间
  timeout: 3 * 1000,
})

const requestContentType = {
  form: 'application/x-www-form-urlencoded',
  formData: 'multipart/form-data',
  json: 'application/json;charset=utf-8',
}

//去除前后空格
const trimObjectValus = obj => {
  if (isPlainObject(obj)) {
    for (let [key, value] of Object.entries(obj || {})) {
      if (typeof value === 'string') {
        obj[key] = value.trim()
      } else {
        trimObjectValus(value)
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => {
      trimObjectValus(item)
    })
  }
}

// 请求拦截
service.interceptors.request.use(
  config => {
    if (config.method.toLowerCase() === 'get') {
      //避免跨域时产生 preflight request
      config.headers['Content-Type'] = requestContentType.form
    } else {
      //动态判断请求类型，请求给事适配为json/form
      //菜单
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = requestContentType.formData
      } else {
        config.headers['Content-Type'] = requestContentType.json
      }
    }
    if (config.data !== undefined && config.data !== null) {
      //去除config.data中的值前后空格
      trimObjectValus(config.data)
      config.data = typeof config.data === 'string' ? config.data.trim() : config.data
      //如果在config.data中穿了对象数据，且不是post，put，patch的则请求处理一下，在config.parmas中传参
      if (isPlainObject(config.data) && !['post', 'put', 'path'].includes(config.method.toLowerCase())) {
        const dataToParams = new URLSearchParams(config.params)
        for (let [key, value] of Object.entries(config.data || {})) {
          if (typeof value === 'object') {
            dataToParams.set(key, JSON.stringify(value))
          } else {
            dataToParams.set(key, value)
          }
        }
        config.params = dataToParams
        //delete请求将会同时在url和请求体传参
        if (config.method.toLowerCase() !== 'delete') {
          config.data = null
        }
      }
    }

    config.cancelToken = useLoginStore().axiosSource.token

    config.headers['token'] = localStorage.getItem('tip-web-token') || ''

    return config
  },
  error => {
    Promise.reject(error)
  },
)
// 响应拦截
service.interceptors.response.use(
  response => {
    if (response.data.code >= -590 && response.data.code <= -588) {
      // 当多个请求时，只处理一个
      useLoginStore().handleAxiosCancel()

      ElMessage({
        showClose: true,
        message: '未授权，请登录',
        type: 'error',
        onClose() {
          useLoginStore().setCurRoute()
          useLoginStore().loginOut()
        },
      })
    }
    // 接收到响应，可以在这做相关的响应批处理
    return response.data
  },
  error => {
    console.log(error, 'error')
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权，请重新登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误，未找到该资源'
          // window.location.href = '/NotFund'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      if (JSON.stringify(error).includes('timeout')) {
        error.message = '连接服务器失败'
      }
    }
    // 统一字段
    // error.response.data.code = error.response.status
    // error.response.data.msg = error.message
    return Promise.resolve(error.response.data)
  },
)
export default service
