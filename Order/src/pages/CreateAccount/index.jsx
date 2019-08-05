import React, {
  Component,
} from 'react';
import {
  Button,
  Input,
  Loading,
  Message,
  Select,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceContainer from '@icedesign/container';
import PageHead from '../../components/PageHead';
import * as api from '../../api';
import * as utils from '../../utils';
import styles from './index.module.scss';
import {
  GroupConfig,
} from '../../baseData';

const {
  Option,
} = Select;

export default class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      value: {},
      account: {
        phone: '暂无',
        password: '暂无',
      },
      groups: {},
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({
      isLoad: true,
    });

    api.getGroups().then((res) => {
      if (res.groups) {
        this.setState({
          groups: res.groups,
        });
      }
    }).catch((e) => {
      console.log(e);
      Message.success(e);
    }).finally(() => {
      this.setState({
        isLoad: false,
      });
    });
  }

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        return;
      }

      const {
        username,
        password,
        phone,
        group,
      } = values;

      if (!utils.checkPhone(phone)) {
        Message.success('手机号格式不对');
        return;
      }
      if (!utils.checkPasswd(password)) {
        Message.success('密码格式不对');
        return;
      }

      this.setState({
        isLoad: true,
      });

      api.createAccount({
        cellphone: phone.toString(),
        password,
        username,
        group_id: group,
      }).then(() => {
        this.setState({
          account: {
            phone,
            password,
          },
          value: {},
        });
      }).catch((e) => {
        Message.success(e);
      }).finally(() => {
        this.setState({
          isLoad: false,
        });
      });
    });
  };

  renderGroup = (groups) => {
    return Object.keys(groups).map((key) => {
      const name = groups[key].name;
      return (
        <Option key={name} value={groups[key].id}>
          {GroupConfig[name]}
        </Option>);
    });
  };

  render() {
    const {
      isLoad,
      account,
      value,
      groups,
    } = this.state;
    return (
      <div>
        <PageHead
          title="创建账号"
        />

        <IceContainer className={styles.container}>
          <Loading visible={isLoad} style={{ display: 'block' }} >
            <IceFormBinderWrapper value={value} ref="form" >
              <div className={styles.formItem}>
                <div className={styles.formLabel}>生成账号：</div>
                <div className={styles.formLabel}>{account.phone}</div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>生成密码：</div>
                <div className={styles.formLabel}>{account.password}</div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>手机号：</div>
                <IceFormBinder name="phone" required message="手机号必填">
                  <Input
                    hasClear
                    placeholder="请输入手机号"
                    style={{ width: '400px' }}
                    htmlType="number"
                    maxLength={32}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="phone" />
                </div>
                <div className={styles.tip}>温馨提示:手机号11位</div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>密码：</div>
                <IceFormBinder name="password" required message="密码必填">
                  <Input
                    hasClear
                    placeholder="请输入密码"
                    style={{ width: '400px' }}
                    htmlType="password"
                    maxLength={32}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="password" />
                </div>
                <div className={styles.tip}>温馨提示:密码8到32位</div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>用户名：</div>
                <IceFormBinder name="username" required message="用户名必填">
                  <Input
                    hasClear
                    placeholder="请输入用户名"
                    style={{ width: '400px' }}
                    maxLength={32}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="username" />
                </div>
                <div className={styles.tip}>温馨提示:用户名最多32位</div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>所属组别：</div>
                <IceFormBinder name="group" required message="组别必填">
                  <Select
                    placeholder="请选择组别"
                    mode="single"
                    style={{ width: '400px' }}
                  >
                    {this.renderGroup(groups)}
                  </Select>
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="group" />
                </div>
              </div>

              <Button type="primary" onClick={this.validateAllFormField}>
                创建账号
              </Button>
            </IceFormBinderWrapper>
          </Loading>
        </IceContainer>
      </div>
    );
  }
}