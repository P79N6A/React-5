/* eslint react/no-string-refs:0 */
import React, {
  Component,
} from 'react';
import {
  Grid,
  Select,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';
import styles from './index.module.scss';

const {
  Row,
  Col,
} = Grid;
const Option = Select.Option;

export default class Filter extends Component {
  state = {
    value: this.props.value,
  };

  formChange = (value) => {
    this.props.onChange(value);
  };

  render() {
    return (
      <IceFormBinderWrapper
        value={this.state.value}
        onChange={this.formChange}
        ref="form"
      >
        <Row wrap gutter="20" className={styles.formRow}>
          <Col l="6">
            <div className={styles.formItem}>
              <span className={styles.formLabel}>月份选择：</span>
              <IceFormBinder triggerType="onBlur" name="month">
                <Select style={{ width: '200px' }}>
                  <Option value="1">本月</Option>
                  <Option value="2">上月</Option>
                </Select>
              </IceFormBinder>
            </div>
          </Col>
          <Col l="6">
            <div className={styles.formItem}>
              <span className={styles.formLabel}>排序选择：</span>
              <IceFormBinder triggerType="onBlur" name="order_field">
                <Select style={{ width: '200px' }}>
                  <Option value="2">累计完成任务</Option>
                  <Option value="1">累计金额</Option>
                </Select>
              </IceFormBinder>
            </div>
          </Col>
        </Row>
      </IceFormBinderWrapper>
    );
  }
}