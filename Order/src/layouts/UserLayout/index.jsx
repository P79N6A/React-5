import React, {
  Component,
} from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  Grid,
} from '@alifd/next';
import routerData from '../../routerConfig';
import styles from './index.module.scss';
import NotFound from '../../components/NotFound';

const {
  Row,
  Col,
} = Grid;

export default class UserLayout extends Component {
  /**
   * 渲染路由组件
   */
  renderNormalRoute = (item, index) => {
    return item.component ? (
      <Route
        key={index}
        path={item.path}
        component={item.component}
        exact={item.exact}
      />
    ) : null;
  };

  render() {
    return (
      <div className={styles.container}>
        <Row wrap className={styles.row}>
          <Col l="12">
            <div className={styles.form}>
              <Switch>
                {/* 渲染路由表 */}
                {routerData.map(this.renderNormalRoute)}

                <Redirect from="/user" to="/user/login" />

                {/* 未匹配到的路由重定向到 NotFound */}
                <Route component={NotFound} />
              </Switch>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}