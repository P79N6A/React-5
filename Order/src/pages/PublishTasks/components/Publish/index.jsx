/* eslint react/no-string-refs:0 */
import React, {
  Component,
} from 'react';
import IceContainer from '@icedesign/container';
import {
  Input,
  Button,
  Message,
  NumberPicker,
  Loading,
  Select,
  Upload,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import PageHead from '../../../../components/PageHead';
import styles from './index.module.scss';
import * as api from '../../../../api';
import {
  platformType,
  GroupConfig,
} from '../../../../baseData';
import upload from '../../../../model/upload';
import * as utils from '../../../../utils';

const {
  Option,
} = Select;

export default class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      value: {},
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
      this.setState({
        groups: res.groups,
      });
    }).catch((e) => {
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
        group,
        platform,
        type,
        number,
        price,
        url,
        direction,
        remark,
        expiredTime,
        directionPics,
      } = values;

      if (!utils.checkUrl(url)) {
        Message.success('链接格式不正确');
        return;
      }

      if (expiredTime <= 0) {
        Message.success('任务完成时间不能小于0');
        return;
      }

      const obj = {};
      obj.timer = utils.formatTime({
        time: expiredTime,
      });

      if (directionPics) {
        const urls = [];
        directionPics.forEach((v) => {
          if (v.state === 'done') {
            urls.push(v.imgURL);
          }
        });
        obj.guide_pic = urls;
      }

      if (remark) {
        obj.remark = remark;
      }

      this.setState({
        isLoad: true,
      });

      api.publishTask(Object.assign(obj, {
        applicant_num: number,
        desc: direction,
        name: type,
        platform: parseInt(platform, 10),
        url,
        reward: price * 100,
        group_id: group,
      })).then(() => {
        Message.success('任务发布成功');
        this.setState({
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

  renderPlatform = () => {
    return Object.keys(platformType).map((key) => {
      return (
        <Option key={key} value={key}>
          {platformType[key]}
        </Option>);
    });
  };

  beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.name) {
        Message.success('文件名获取失败');
        reject();
      } else {
        resolve();
      }
    });
  };

  onSuccess = (file) => {
    Message.success('上传成功');
  };

  onError = (e) => {
    Message.success('上传文件失败');
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
      value,
      groups,
    } = this.state;
    return (
      <div>
        <PageHead title="填写基本信息" />
        <IceContainer style={{ padding: '40px' }}>
          <Loading tip="发布任务中..." visible={isLoad} style={{ display: 'block' }} >
            <IceFormBinderWrapper value={value} ref="form" >
              <div className={styles.formItem}>
                <div className={styles.formLabel}>所属组别：</div>
                <IceFormBinder name="group" required message="组别必填">
                  <Select
                    placeholder="请选择组别"
                    mode="single"
                    style={{ width: '400px' }}
                  >
                    {this.renderGroup(groups)}
                    <Option value={0}>全部</Option>
                  </Select>
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="group" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>平台：</div>
                <IceFormBinder name="platform" required message="平台必填">
                  <Select
                    placeholder="请选择平台"
                    mode="single"
                    style={{ width: '400px' }}
                  >
                    {this.renderPlatform()}
                  </Select>
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="platform" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>类型：</div>
                <IceFormBinder name="type" required message="类型必填">
                  <Input
                    placeholder="请输入类型"
                    style={{ width: '400px' }}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="type" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>单价：</div>
                <IceFormBinder name="price" required message="单价必填">
                  <NumberPicker step={0.1} />
                </IceFormBinder>
                <div style={{ marginLeft: '10px' }}>元</div>
                <div className={styles.formError}>
                  <IceFormError name="price" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>接单人数：</div>
                <IceFormBinder name="number" required message="接单人数必填">
                  <NumberPicker />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="number" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>链接：</div>
                <IceFormBinder name="url" required message="链接必填">
                  <Input
                    placeholder="请输入链接"
                    style={{ width: '400px' }}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="url" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>方向：</div>
                <IceFormBinder name="direction" required message="方向必填">
                  <Input
                    placeholder="请输入方向"
                    style={{ width: '400px' }}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="direction" />
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>方向图片：</div>
                <IceFormBinder name="directionPics" >
                  <Upload.Card
                    listType="card"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    request={upload}
                    beforeUpload={this.beforeUpload}
                    onError={this.onError}
                    onSuccess={this.onSuccess}
                    limit={5}
                  />
                </IceFormBinder>
                <div style={{ marginLeft: '10px' }}>(选填)</div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>备注：</div>
                <IceFormBinder name="remark" >
                  <Input
                    placeholder="选填"
                    style={{ width: '400px' }}
                  />
                </IceFormBinder>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}>完成时间：</div>
                <IceFormBinder name="expiredTime" required message="任务完成时间必填">
                  <NumberPicker />
                </IceFormBinder>
                <div style={{ marginLeft: '10px' }}>分钟</div>
                <div className={styles.formError}>
                  <IceFormError name="expiredTime" />
                </div>
              </div>

              <Button type="primary" onClick={this.validateAllFormField}>
                发布任务
              </Button>
            </IceFormBinderWrapper>
          </Loading>
        </IceContainer>
      </div>
    );
  }
}