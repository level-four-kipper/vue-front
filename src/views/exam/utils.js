/**
 * 日期转换 把倒计时总秒数转换为“0分0秒”的格式
 * @param {*} seconds 总秒数
 * @returns String xx天xx小时xx分xx秒
 */
export function dateTransform(seconds) {
  let [minute, second] = [0, 0, 0, 0] // 初始化
  if (seconds > 0) {
    minute = Math.floor(seconds / 60)
    second = Math.floor(seconds) - minute * 60
  }
  // 小于10的，在前面加0
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  // return day + '天' + hour + '小时' + minute + '分' + second + '秒'
  return minute + ':' + second
}
