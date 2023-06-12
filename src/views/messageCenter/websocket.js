import SockJS from 'sockjs-client/dist/sockjs.min.js'
import Stomp from 'stompjs'

let socket = null
let stompClient = null
let timer = null
const timeout = 5 * 1000 // 5秒

export function websocketMix(notificationInfo) {
  // 初始化WebSocket
  const initWebSocket = () => {
    connection()
    // 断开重连机制：尝试发送消息,捕获异常发生时建立重连
    timer = setInterval(() => {
      try {
        console.log('发送信息：test')
        stompClient.send('test')
      } catch (err) {
        console.log('发送信息：', err)
        connection()
      }
    }, timeout)
  }
  // 建立WebSocket连接
  const connection = () => {
    // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
    const baseURL = window.location.origin + '/api/tip-ws/'
    const locationBaseURL = 'http://10.13.55.29:9026/tip-ws/' // 高君宝本地
    socket = new SockJS(baseURL.indexOf('127.0.0.1') !== -1 || baseURL.indexOf('localhost') !== -1 ? locationBaseURL : baseURL) // 站点地址
    // 获取STOMP子协议的客户端对象
    stompClient = Stomp.over(socket)
    stompClient.connect(
      { token: localStorage.getItem('tip-web-token') || '' }, // 需要申请个固定的token
      () => {
        const userId = localStorage.getItem('tip-web-user-id')
        // 订阅服务端提供的某个topic
        stompClient.subscribe(`/user/${userId}/topic/single`, msg => {
          console.log('服务端响应的数据：', msg.body)
          notificationInfo.value = JSON.parse(msg.body)
          // localStorage.setItem('tip-web-message-websocket', msg.body)
        })
      },
      err => {
        // 连接发生错误时的处理函数
        console.log('连接发送错误：', err)
      }
    )
  }
  // 断开连接
  const disconnect = () => {
    if (stompClient === null) return
    console.log('断开连接')
    stompClient.disconnect()
    // notificationInfo.value = JSON.parse(localStorage.getItem('tip-web-message-websocket')) || []
    notificationInfo.value = []
    stompClient = null
    clearInterval(timer)
  }

  return {
    initWebSocket,
    disconnect
  }
}
