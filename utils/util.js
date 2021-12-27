const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const DateFormat = function (date,fmt) { //author: meizz
  var o = {
    "M+": new Date(date).getMonth() + 1, //月份
    "d+":new Date(date).getDate(), //日
    "h+": new Date(date).getHours(), //小时
    "m+": new Date(date).getMinutes(), //分
    "s+": new Date(date).getSeconds(), //秒
    "q+": Math.floor((new Date(date).getMonth() + 3) / 3), //季度
    "S": new Date(date).getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date(date).getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getRandomColor = () => {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

module.exports = {
  formatNumber,
  formatTime,
  DateFormat,
  getRandomColor
}
