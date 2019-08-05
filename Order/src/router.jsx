/**
 * 定义应用路由
 */
import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';

// 按照 Layout 分组路由
// UserLayout 对应的路由：/user/xxx
// BasicLayout 对应的路由：/xxx
const router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/user" component={UserLayout} />
        <Route path="/" component={BasicLayout} />
      </Switch>
    </BrowserRouter>
  );
};

export default router();