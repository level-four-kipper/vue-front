/**
 *
 * RSA加密解密=
 * **/
import { ElMessage } from 'element-plus'
import { JSEncrypt } from 'jsencrypt' // 导入
import { fetchPublicKey } from '@/api/login.js'

// 公钥
let publicKey = localStorage.getItem('tip-web-publicKey') || ''

const privateKey= ''

// 公钥
export async function getPublicKey(){
  let key = publicKey
  if(!key){
    await fetchPublicKey().then(res => {
      if (res.code !== 0) {
        ElMessage({ showClose: true, message: res.msg, type: 'warning' })
        return
      }

      localStorage.setItem('tip-web-publicKey', res.data)
    })
  }
  return await key
}


// 公钥
export function getPrivateKey(){
  return ''
}

// 加密
export async function encrypt (txt) {
  const encrypt = new JSEncrypt()
  const key = await getPublicKey();
  encrypt.setPublicKey(key) // 设置公钥
  return await encrypt.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt (txt) {
  const encrypt = new JSEncrypt()
  encrypt.setPrivateKey(privateKey)
  return encrypt.decrypt(txt)
}
