import TaskProgress from './pages/TaskProgress';

export const platformType = {
  0: '微博',
  1: '豆瓣',
  2: '微信',
  3: '抖音',
  4: '今日头条',
  5: '知乎',
  6: '腾讯视频',
  7: '爱奇艺',
  8: '优酷',
  9: 'B站',
  10: '芒果TV',
  11: '猫眼',
  12: '淘票票',
  13: '腾讯新闻',
  14: '网易新闻',
  15: '小红书',
  16: 'QQ音乐',
  17: 'QQ',
  18: '虎扑体育',
  19: '快手',
  20: '兔区',
  21: '百度贴吧',
  22: '新浪新闻',
};

export const taskTabsConfig = [{
  key: 'progress',
  tab: '进行中',
  path: '/task/details/progress',
  info: {
    name: '接单时间',
    tab: 1,
  },
  component: TaskProgress,
}, {
  key: 'finish',
  tab: '已完成',
  path: '/task/details/finish',
  info: {
    name: '完成时间',
    tab: 4,
  },
  component: TaskProgress,
}, {
  key: 'refuse',
  tab: '未达标',
  path: '/task/details/refuse',
  info: {
    name: '未达标时间',
    tab: 5,
  },
  component: TaskProgress,
}];

export const GroupConfig = {
  A: 'A组',
  B: 'B组',
  C: 'C组',
  D: 'D组',
  E: 'E组',
  F: 'F组',
  G: 'G组',
  H: 'H组',
};