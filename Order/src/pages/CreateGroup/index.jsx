import React, {
  Component,
} from 'react';
import {
  Button,
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
import styles from './index.module.scss';
import {
  GroupConfig,
} from '../../baseData';

const {
  Option,
} = Select;

export default class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      value: {},
    };
  }

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        return;
      }

      const {
        group,
      } = values;

      this.setState({
        isLoad: true,
      });

      api.createGroup({
        names: group,
      }).then(() => {
        this.setState({
          value: {},
        });
        Message.success('创建分组成功');
      }).catch((e) => {
        Message.success(e);
      }).finally(() => {
        this.setState({
          isLoad: false,
        });
      });
    });
  };

  renderGroup = () => {
    return Object.keys(GroupConfig).map((key) => {
      return (
        <Option key={key} value={key}>
          {GroupConfig[key]}
        </Option>);
    });
  };

  render() {
    const {
      isLoad,
      value,
    } = this.state;
    return (
      <div>
        <PageHead
          title="创建分组"
        />

        <IceContainer className={styles.container}>
          <Loading tip="创建分组中..." visible={isLoad} style={{ display: 'block' }} >
            <IceFormBinderWrapper value={value} ref="form" >
              <div className={styles.formItem}>
                <div className={styles.formLabel}>选择分组：</div>
                <IceFormBinder name="group" required message="组别必填">
                  <Select
                    mode="multiple"
                    style={{ width: '400px' }}
                  >
                    {this.renderGroup()}
                  </Select>
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="group" />
                </div>
              </div>

              <Button type="primary" onClick={this.validateAllFormField}>
                创建
              </Button>
            </IceFormBinderWrapper>
          </Loading>
        </IceContainer>
      </div>
    );
  }
}