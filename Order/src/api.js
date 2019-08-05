import axios from 'axios';
import * as config from './config';

// axios 配置
axios.defaults.timeout = config.TIMEOUT;
axios.defaults.baseURL = config.BASEURL;

// http request 拦截器（所有发送的请求都要从这儿过一次），通过这个，我们就可以把token传到后台，我这里是使用sessionStorage来存储token等权限信息和用户信息，若要使用cookie可以自己封装一个函数并import便可使用
axios.interceptors.request.use((configs) => {
  const token = sessionStorage.getItem(config.TOKENKEY);
  configs.data = JSON.stringify(configs.data);
  configs.headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    configs.headers.Authorization = token;
  }
  return configs;
}, (err) => {
  return Promise.reject(err);
});

const tokenInvalid = '该账号在另一台设备上登陆,请重新登陆';

function jumpLogin() {
  if (global.jumpLogin) {
    global.jumpLogin();
  }
}

// http response 拦截器（所有接收到的请求都要从这儿过一次）
axios.interceptors.response.use((response) => {
  switch (response.data.code) {
    case 0:
      return response.data;
    case 20103: // token失效
      jumpLogin();
      return Promise.reject(tokenInvalid);
    default:
      return Promise.reject(response.data.message);
  }
}, (error) => {
  return Promise.reject(error.message);
});

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params,
    }).then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then((response) => {
      resolve(response.data);
    }, (err) => {
      reject(err);
    });
  });
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then((response) => {
      resolve(response.data);
    }, (err) => {
      reject(err);
    });
  });
}

/**
 * 登陆
 * @date   2019-06-25
 * @param  {Object}   data
 * @return {Promise}
 */
export function login(data = {}) {
  return post('/admin/login', data);
}

/**
 * 发布任务
 * @date   2019-06-27
 * @param  {Object}   data
 * @return {Promise}
 */
export function publishTask(data = {}) {
  return post('/task', data);
}

/**
 * 获取任务列表
 * @date   2019-06-27
 * @param  {Object}   data
 * @return {Promise}
 */
export function getTasks(data = {}) {
  return get('/admin/tasks', data);
}

/**
 * 获取审核任务列表
 * @date   2019-06-28
 * @param  {Object}   data
 * @return {Promise}
 */
export function getReviewTasks(data = {}) {
  return get('/admin/reviewlist', data);
}

/**
 * 创建账号
 * @date   2019-07-02
 * @param  {Object}   data
 * @return {Promise}
 */
export function createAccount(data = {}) {
  return post('/admin/createuser', data);
}

/**
 * 获取临时密钥
 * @date   2019-07-02
 * @param  {Object}   data
 * @return {Promise}
 */
export function getSecrectKey(data = {}) {
  return get('/common/cos', data);
}

/**
 * 审核任务
 * @date   2019-07-03
 * @param  {Object}   data
 * @return {Promise}
 */
export function reviewTasks(data = {}) {
  return put('/admin/reviewtask', data);
}

/**
 * 审核任务
 * @date   2019-07-04
 * @param  {Object}   data
 * @return {Promise}
 */
export function getUsers(data = {}) {
  return get('/admin/users', data);
}

/**
 * 获取任务报名列表
 * @date   2019-07-04
 * @param  {Object}   data
 * @return {Promise}
 */
export function getTaskApplicants(data = {}) {
  return get('/task/applicants', data);
}

/**
 * 获取任务报名列表
 * @date   2019-07-05
 * @param  {Object}   data
 * @return {Promise}
 */
export function pay(data = {}) {
  return post('/admin/pay', data);
}

/**
 * 创建组别
 * @date   2019-07-05
 * @param  {Object}   data
 * @return {Promise}
 */
export function createGroup(data = {}) {
  return post('/admin/group', data);
}


/**
 * 获取组别
 * @date   2019-07-05
 * @param  {Object}   data
 * @return {Promise}
 */
export function getGroups(data = {}) {
  return get('/admin/groups', data);
}

/**
 * 退出登陆
 * @date   2019-07-15
 * @param  {Object}   data
 * @return {Promise}
 */
export function loginOut(data = {}) {
  return post('/admin/logout', data);
}

/**
 * 获取排行榜
 * @date   2019-07-25
 * @param  {Object}   data
 * @return {Promise}
 */
export function getRanks(data = {}) {
  return get('/admin/ranking', data);
}

/**
 * 授予奖项
 * @date   2019-07-26
 * @param  {Object}   data
 * @return {Promise}
 */
export function award(data = {}) {
  return post('/admin/award', data);
}

/**
 * 获取流水
 * @date   2019-07-26
 * @param  {Object}   data
 * @return {Promise}
 */
export function getFundflow(data = {}) {
  return get('/admin/fundflow', data);
}

/**
 * 获取指定平台账号
 * @date   2019-08-01
 * @param  {Object}   data
 * @return {Promise}
 */
export function getAccounts(data = {}) {
  return get('/accounts', data);
}