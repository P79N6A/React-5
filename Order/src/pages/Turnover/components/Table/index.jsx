import React, {
  Component,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {
  Table,
  Pagination,
  Message,
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
import * as api from '../../../../api';
import * as utils from '../../../../utils';

const incomeConfig = {
  1: '任务完成奖励',
  2: '优秀奖',
  3: '鼓励奖',
  4: '积极奖',
};
const payConfig = {
  0: '未结算',
  1: '工资结算',
};

const getData = (data) => {
  return data.map((v) => {
    return {
      pay: payConfig[v.pay_type],
      income: incomeConfig[v.income_type],
      money: utils.formatMoney({
        money: v.amount,
      }),
      date: utils.formatUnix({
        unix: v.time,
        fmt: 'Y-M-D h:m:s',
      }),
    };
  });
};

@withRouter
export default class TurnoverTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      isLoading: false,
      data: [],
      count: 0,
    };
    this.id = this.props.location.state.user.id;
  }

  componentDidMount() {
    this.fetchData(this.state.current);
  }

  fetchData = (page, page_size = 10) => {
    this.setState({
      isLoading: true,
    });
    api.getFundflow({
      page,
      page_size,
      uid: this.id,
    }).then((res) => {
      this.setState({
        count: res.pagination.count,
        data: getData(res.fundflows),
      });
    }).catch((e) => {
      Message.success(e);
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  };

  handlePaginationChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.fetchData(current);
    });
  };

  render() {
    const {
      isLoading,
      data,
      current,
      count,
    } = this.state;

    return (
      <div className={styles.container}>
        <IceContainer>
          <Table loading={isLoading} dataSource={data} hasBorder={false}>
            <Table.Column title="收入类型" dataIndex="income" />
            <Table.Column title="结算类型" dataIndex="pay" />
            <Table.Column title="金额(元)" dataIndex="money" />
            <Table.Column title="创建时间" dataIndex="date" />
          </Table>
          <Pagination
            className={styles.pagination}
            current={current}
            onChange={this.handlePaginationChange}
            total={count}
          />
        </IceContainer>
      </div>
    );
  }
}