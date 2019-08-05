// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [{
  name: '退出',
  path: '/user/login',
  icon: 'yonghu',
}];

const asideMenuConfig = [{
  name: '创建分组',
  path: '/create/group',
  icon: 'publish',
}, {
  name: '创建账号',
  path: '/create/account',
  icon: 'publish',
}, {
  name: '发布任务',
  path: '/publish/tasks',
  icon: 'publish',
}, {
  name: '任务管理',
  path: '/tasks',
  icon: 'publish',
}, {
  name: '审核任务',
  path: '/check/task',
  icon: 'publish',
}, {
  name: '用户管理',
  path: '/membership',
  icon: 'publish',
}, {
  name: '排行榜',
  path: '/rank',
  icon: 'publish',
}];

export {
  headerMenuConfig,
  asideMenuConfig,
};