import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/stores/login.js'

/**
 * @description: 节流函数
 * @param {Function} fn 延时调用函数
 * @param {Number} delay 延时时间
 * @param {Number} least 至少多长时间触发一次
 * @return {Function} 延迟执行方法
 */
export function throttle(fn, delay, least = 0) {
  let timer = null
  let previous = null
  return function () {
    let _this = this
    let _ags = arguments
    let now = new Date()
    if (!previous) previous = now
    if (now - previous > least) {
      fn.apply(_this, _ags)
      previous = now //重置上一次开始时间
    } else {
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(_this, _ags)
      }, delay)
    }
  }
}

/**
 * @description: 防抖函数
 * @param {Function} fn 延时调用函数
 * @param {Number} delay 延时时间
 * @return {Function} 延迟执行方法
 */
export function debounce(fn, delay = 1000) {
  let timeout = null
  return function () {
    let _this = this
    let _ags = arguments
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(_this, _ags)
    }, delay)
  }
}

/**
 * @description: html字符串转纯文本
 * @param {string} html
 * @return {string} 纯文本
 */
export function htmlToString(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\n|\r\n/g, ' ')
}

/**
 * @description: 重新构建后，提醒用户刷新页面
 * @param {object} eventErr
 * @return {*}
 */
export function handleError(eventErr) {
  if ((eventErr.srcElement.localName == 'link' || eventErr.srcElement.localName == 'script') && !useLoginStore().errorFlag) {
    useLoginStore().setErrorFlag(true)
    ElMessage({
      showClose: true,
      message: '因版本更新，页面需重新载入',
      type: 'warning'
    })
    window.location.reload(true)
  }
  eventErr.preventDefault()
}

/**
 * 获取当前时间
 * @returns {string} 2023-2-2 12:12
 */
export function getCurrentTime() {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()

  month = month > 9 ? month : `0${month}`
  day = day > 9 ? day : `0${day}`
  hour = hour > 9 ? hour : `0${hour}`
  minute = minute > 9 ? minute : `0${minute}`

  return `${year}-${month}-${day} ${hour}:${minute}`
}

/**
 * 获取浏览器型号与版本号
 * @returns
 */
export function getBrowserInfo() {
  var UserAgent = navigator.userAgent.toLowerCase()

  var browser = null
  var browserArray = {
    IE: window.ActiveXObject || 'ActiveXObject' in window, // IE
    Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
    Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1, // safari浏览器
    Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(UserAgent) // 微信浏览器
  }

  for (var i in browserArray) {
    if (browserArray[i]) {
      var versions = ''
      if (i == 'IE') {
        versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2]
      } else if (i == 'Chrome') {
        for (var mt in navigator.mimeTypes) {
          //检测是否是360浏览器(测试只有pc端的360才起作用)
          if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
            i = '360'
          }
        }
        versions = UserAgent.match(/chrome\/([\d.]+)/)[1]
      } else if (i == 'Firefox') {
        versions = UserAgent.match(/firefox\/([\d.]+)/)[1]
      } else if (i == 'Opera') {
        versions = UserAgent.match(/opera\/([\d.]+)/)[1]
      } else if (i == 'Safari') {
        versions = UserAgent.match(/version\/([\d.]+)/)[1]
      } else if (i == 'Edge') {
        versions = UserAgent.match(/edge\/([\d.]+)/)[1]
      } else if (i == 'QQBrowser') {
        versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1]
      }

      browser = {
        name: i,
        version: versions
      }
    }
  }

  return browser || { name: '其他', version: '其他' }
}

/**
 * 获取任意元素距离顶部的距离
 * @param {dom} elem dom元素
 * @returns
 */
export function getElementTop(elem) {
  //获得elem元素距相对定位的父元素的top
  let elemTop = elem.offsetTop

  //将elem换成起相对定位的父元素
  elem = elem.offsetParent

  while (elem != null) {
    /*
    只要还有相对定位的父元素
    获得父元素 距他父元素的top值,累加到结果中
    再次将elem换成他相对定位的父元素上;
    */
    elemTop += elem.offsetTop

    elem = elem.offsetParent
  }

  return elemTop
}
