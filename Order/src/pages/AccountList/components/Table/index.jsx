import React, {
  Component,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {
  Table,
  Message,
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import Filter from '../Filter';
import styles from './index.module.scss';
import * as api from '../../../../api';

const getData = (data) => {
  return data.map((v) => {
    return {
      nickname: v.account,
      url: v.homepage_url,
    };
  });
};

@withRouter
export default class AccountTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
    };
    this.value = {
      platform: 0,
    };
    this.id = this.props.location.state.user.id;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({
      isLoading: true,
    });
    api.getAccounts(Object.assign({
      uid: this.id,
    }, this.value)).then((res) => {
      this.setState({
        data: getData(res.accounts),
      });
    }).catch((e) => {
      Message.success(e);
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  };

  handleFilterChange = (e) => {
    console.log(e);
    this.fetchData();
  };

  render() {
    const {
      isLoading,
      data,
    } = this.state;
    return (
      <div className={styles.container}>
        <IceContainer>
          <Filter onChange={this.handleFilterChange} value={this.value} />
        </IceContainer>
        <IceContainer>
          <Table loading={isLoading} dataSource={data} hasBorder={false}>
            <Table.Column title="昵称" dataIndex="nickname" />
            <Table.Column title="主页链接" dataIndex="url" />
          </Table>
        </IceContainer>
      </div>
    );
  }
}