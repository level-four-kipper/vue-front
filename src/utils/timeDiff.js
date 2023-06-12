// 计算两个时间之间的时间差 多少天时分秒
function intervalTime(startTime, endTime) {
  const date1 = new Date(startTime) // 开始时间
  const date2 = new Date(endTime) // 结束时间

  // 结束时间如果小于开始时间，默认'--'
  if (date2 - date1 < 0) return '--'

  var seconds = Math.floor((date2 - date1) / 1000) //时间差的秒数
  var minutes = Math.floor(seconds / 60) //分钟数
  var hours = Math.floor(minutes / 60) //小时
  var days = Math.floor(hours / 24)

  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60 || minutes == 60) {
    return minutes + '分钟前'
  } else if (hours < 24 || hours == 24) {
    return hours + '小时前'
  } else if (days < 7 || days == 7) {
    return days + '天前'
  } else if (days < 29 || days == 29) {
    return Math.floor(days / 7) + '周前'
  } else if (days < 365) {
    return Math.floor(days / 30) + '月前'
  } else {
    return '--'
  }
  //  return days + '天 ' + hours + '小时 '
}
//  返回 年-月-日
export function crtTimeFtt(val, row) {
  if (val != null) {
    var date = new Date(val)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}
export default intervalTime
