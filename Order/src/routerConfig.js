// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import UserLogin from './pages/UserLogin';
import Tasks from './pages/Tasks';
import CheckTask from './pages/CheckTask';
import PublishTasks from './pages/PublishTasks';
import CreateAccount from './pages/CreateAccount';
import Membership from './pages/Membership';
import TaskDetails from './pages/TaskDetails';
import TaskProgress from './pages/TaskProgress';
import CreateGroup from './pages/CreateGroup';
import Rank from './pages/Rank';
import Turnover from './pages/Turnover';
import AccountList from './pages/AccountList';

const routerConfig = [{
  path: '/user/login',
  component: UserLogin,
}, {
  path: '/tasks',
  component: Tasks,
}, {
  path: '/check/task',
  component: CheckTask,
}, {
  path: '/publish/tasks',
  component: PublishTasks,
}, {
  path: '/create/account',
  component: CreateAccount,
}, {
  path: '/membership',
  component: Membership,
}, {
  path: '/task/details',
  component: TaskDetails,
}, {
  path: '/details/progress',
  component: TaskProgress,
}, {
  path: '/create/group',
  component: CreateGroup,
}, {
  path: '/rank',
  component: Rank,
}, {
  path: '/turnover',
  component: Turnover,
}, {
  path: '/account/list',
  component: AccountList,
}];

export default routerConfig;