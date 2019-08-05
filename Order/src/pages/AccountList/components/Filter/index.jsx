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
import {
  platformType,
} from '../../../../baseData';

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

  renderPlatform = () => {
    return Object.keys(platformType).map((key) => {
      return (
        <Option key={key} value={parseInt(key, 10)}>
          {platformType[key]}
        </Option>);
    });
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
              <span className={styles.formLabel}>平台选择：</span>
              <IceFormBinder triggerType="onBlur" name="platform">
                <Select style={{ width: '200px' }} >
                  {this.renderPlatform()}
                </Select>
              </IceFormBinder>
            </div>
          </Col>
        </Row>
      </IceFormBinderWrapper>
    );
  }
}