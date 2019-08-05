import React, {
  Component,
} from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  Nav,
  Loading,
  Message,
} from '@alifd/next';
import FoundationSymbol from '@icedesign/foundation-symbol';
import {
  headerMenuConfig,
} from '../../../../menuConfig';
import './index.scss';
import * as api from '../../../../api';

@withRouter
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
    };
  }

  link = (e) => {
    e.preventDefault();
    this.setState({
      isLoad: true,
    });

    api.loginOut().then(() => {
      this.props.history.replace('/user');
    }).catch((error) => {
      Message.success(error);
      this.setState({
        isLoad: false,
      });
    });
  };

  render() {
    const {
      location = {},
    } = this.props;
    const {
      pathname,
    } = location;
    const {
      isLoad,
    } = this.state;
    return (
      <Loading tip="退出登陆中..." visible={isLoad} fullScreen >
        <div className="header-container">
          <div className="header-navbar">
            <Nav
              className="header-navbar-menu"
              selectedKeys={[pathname]}
              defaultSelectedKeys={[pathname]}
              direction="hoz"
              type="secondary"
            >
              {headerMenuConfig &&
                headerMenuConfig.length > 0 &&
                headerMenuConfig.map((nav) => {
                  const linkProps = {};
                  linkProps.to = nav.path;
                  return (
                    <Nav.Item key={nav.path}>
                      <Link {...linkProps} onClick={this.link}>
                        <span>
                          {nav.icon ? (
                            <FoundationSymbol size="small" type={nav.icon} />
                          ) : null}
                          {nav.name}
                        </span>
                      </Link>
                    </Nav.Item>
                  );
                })}
            </Nav>
          </div>
        </div>
      </Loading>
    );
  }
}