
export const formatTime = date => {
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

const trim = (x) => {
  return x.replace(/^\s+|\s+$/gm, '');
}

export const pushIndent = content => {
  let newContent = '';
  let lines = [];
  for(let i in content){
    let s = content[i];
    let code = s.charCodeAt();
    if (code == 8220 || code == 8221) {
      s = '"';
    } else if (code == 8216 || code == 8217) {
      s = '\'';
    } else if (code >= 48 && code <= 56 || code >= 65 && code <= 91 || code >= 97 && code <= 122) {
      s = String.fromCharCode(code + 65248);  //宽字符的数字、大小写字母转换
    } else if (code == 10 || code == 13) {  // 10是换行符
      if (trim(newContent)!==''){
        lines.push(`\u3000\u3000${trim(newContent)}\n`);
        newContent = '';
        continue;
      }
    }
    newContent += s;
  }
  trim(newContent) !== '' && lines.push(`\u3000\u3000${trim(newContent)}\n`);
  return lines;
}