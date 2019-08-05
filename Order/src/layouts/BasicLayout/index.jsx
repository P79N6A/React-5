import React, {
  Component,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import Layout from '@icedesign/layout';
import Header from './components/Header';
import Aside from './components/Aside';
import MainRoutes from './MainRoutes';
import './index.scss';
import * as config from '../../config';

@withRouter
export default class BasicLayout extends Component {
  componentDidMount() {
    const token = sessionStorage.getItem(config.TOKENKEY);
    global.jumpLogin = () => {
      this.props.history.replace('/user');
    };
    if (!token) {
      global.jumpLogin();
    }
  }

  render() {
    return (
      <Layout
        fixable
        style={{ minHeight: '100vh' }}
        className="ice-design-layout"
      >
        <Layout.Aside width={240}>
          <Aside />
        </Layout.Aside>

        <Layout.Section>
          <Layout.Main scrollable>
            <Layout.Header>
              <Header />
            </Layout.Header>
            <div className="main-container">
              <MainRoutes />
            </div>
          </Layout.Main>
        </Layout.Section>
      </Layout>
    );
  }
}