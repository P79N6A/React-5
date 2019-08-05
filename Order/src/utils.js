/**
 * 将分格式化元
 * @date   2019-07-01
 * @return {[type]}   [description]
 */
const moneyType = {
  minute: 1,
  yuan: 3,
};

export function formatMoney({
  money,
  from = 'minute',
  to = 'yuan',
}) {
  if (!moneyType[from] || !moneyType[to]) {
    throw new Error('传入的参数有误');
  }

  const diff = moneyType[to] - moneyType[from];
  return +(money / Math.pow(10, diff)).toFixed(1);
}

const types = {
  1: '[object Object]',
  2: '[object Number]',
  3: '[object String]',
};

function TypeJudgment({
  arg,
  type = 1,
}) {
  return Reflect.toString.call(arg) === types[type];
}

export function isObject(arg) {
  return TypeJudgment({
    arg,
  });
}

export function isNumber(arg) {
  return TypeJudgment({
    arg,
    type: 2,
  });
}

export function isString(arg) {
  return TypeJudgment({
    arg,
    type: 3,
  });
}

/**
 * 密码验证,只能输入8-32个字母、数字、下划线
 * @date   2019-07-02
 * @param  {[type]}   s [description]
 * @return {Boolean}    [description]
 */
export function checkPasswd(s) {
  const patrn = /^(\w){8,32}$/;
  if (!patrn.exec(s)) return false;
  return true;
}

/**
 * 手机号验证
 * @date   2019-07-02
 * @return {[type]}   [description]
 */
export function checkPhone(value) {
  if (!(/^1[3456789]\d{9}$/.test(value))) {
    return false;
  }
  return true;
}

export function checkUsername(value) {
  if (!(/^[a-zA-Z0-9_-]{1,32}$/.test(value))) {
    return false;
  }
  return true;
}

export function checkUrl(url) {
  return url.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
}

const timeType = {
  s: 1,
  m: 2,
  h: 3,
};
export function formatTime({
  time,
  from = 'm',
  to = 's',
}) {
  if (!timeType[from] || !timeType[to]) {
    throw new Error('传入的参数有误');
  }
  const diff = timeType[to] - timeType[from];
  return time / Math.pow(60, diff);
}

/**
 * 时间戳格式化
 * @date   2019-07-04
 * @param  {[type]}   unix 时间戳
 * @param  {[type]}   fmt  时间格式  Y-M-D h:m:s
 * @return {string}
 */
export function formatUnix({
  unix,
  fmt,
}) {
  if (!isString(fmt)) {
    throw new Error('传入的参数有误');
  }

  const date = new Date(unix * 1000);
  const map = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };

  Object.keys(map).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, addZero(map[k]));
    }
  });
  return fmt;
}

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}