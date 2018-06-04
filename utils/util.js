const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const pushIndent = content => {
  let x = content.split('\n');
  return `\u3000\u3000${x.join('\n\u3000\u3000')}`;
}

module.exports = {
  formatTime: formatTime,
  pushIndent: pushIndent,
}
