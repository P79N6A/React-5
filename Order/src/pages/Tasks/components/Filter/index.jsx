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
  GroupConfig,
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
    return (
      <IceFormBinderWrapper
        value={this.state.value}
        onChange={this.formChange}
        ref="form"
      >
        <Row wrap gutter="20" className={styles.formRow}>
          <Col l="6">
            <div className={styles.formItem}>
              <span className={styles.formLabel}>组别选择：</span>
              <IceFormBinder triggerType="onBlur" name="group_id">
                <Select style={{ width: '200px' }} >
                  {this.renderGroup(this.props.groups)}
                  <Option key="all" value={0} >全部</Option>;
                </Select>
              </IceFormBinder>
            </div>
          </Col>
        </Row>
      </IceFormBinderWrapper>
    );
  }
}