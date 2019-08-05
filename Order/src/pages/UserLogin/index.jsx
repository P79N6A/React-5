/* eslint react/no-string-refs:0 */
import React, {
  Component,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {
  Input,
  Button,
  Checkbox,
  Message,
  Loading,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/foundation-symbol';
import styles from './index.module.scss';
import * as api from '../../api';
import * as config from '../../config';

@withRouter
class UserLogin extends Component {
  static displayName = 'UserLogin';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      value: {
        username: '',
        password: '',
        checkbox: false,
      },
    };
  }

  componentDidMount() {
    sessionStorage.removeItem(config.TOKENKEY);
    const username = localStorage.getItem(config.ACCOUNT);

    if (username) {
      const password = localStorage.getItem(config.PASSWORD);
      this.setState({
        value: {
          checkbox: true,
          username,
          password,
        },
      });
    }
  }

  handleSubmit = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }

      const {
        checkbox,
        username,
        password,
      } = values;

      this.setState({
        isLoad: true,
      });

      api.login({
        username,
        password,
      }).then((res) => {
        if (checkbox) {
          localStorage.setItem(config.ACCOUNT, username);
          localStorage.setItem(config.PASSWORD, password);
        } else {
          localStorage.removeItem(config.ACCOUNT);
          localStorage.removeItem(config.PASSWORD);
        }
        sessionStorage.setItem(config.TOKENKEY, res.token);
        this.props.history.push('/');
      }).catch((e) => {
        Message.success(e);
        this.setState({
          isLoad: false,
        });
      });
    });
  };

  onChange = (e) => {
    this.setState({
      'value.checkbox': e,
    });
  }

  render() {
    const {
      value,
    } = this.state;

    return (
      <div className={styles.container}>
        <h4 className={styles.title}>登 录</h4>
        <Loading tip="登陆中..." visible={this.state.isLoad} style={{ display: 'block' }} >
          <IceFormBinderWrapper value={this.state.value} ref="form" >
            <div className={styles.formItems}>
              <div className={styles.formItem}>
                <IceIcon type="person" size="small" className={styles.inputIcon} />
                <IceFormBinder name="username" required message="必填">
                  <Input
                    size="large"
                    maxLength={20}
                    placeholder="用户名"
                    className={styles.inputCol}
                    hasClear
                    autoComplete="off"
                  />
                </IceFormBinder>
                <IceFormError name="username" />
              </div>

              <div className={styles.formItem}>
                <IceIcon type="lock" size="small" className={styles.inputIcon} />
                <IceFormBinder name="password" required message="必填">
                  <Input
                    size="large"
                    htmlType="password"
                    placeholder="密码"
                    className={styles.inputCol}
                    hasClear
                    autoComplete="off"
                  />
                </IceFormBinder>
                <IceFormError name="password" />
              </div>

              <div className={styles.formItem}>
                <IceFormBinder name="checkbox">
                  <Checkbox className={styles.checkbox} checked={value.checkbox} onChange={this.onChange}>记住账号</Checkbox>
                </IceFormBinder>
              </div>

              <div className={styles.footer}>
                <Button
                  type="primary"
                  size="large"
                  onClick={this.handleSubmit}
                  className={styles.submitBtn}
                >
                  登 录
                </Button>
              </div>
            </div>
          </IceFormBinderWrapper>
        </Loading>
      </div>
    );
  }
}

export default UserLogin;