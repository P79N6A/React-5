import React, {
  Component,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {
  Table,
  Pagination,
  Button,
  Message,
  Dialog,
  NumberPicker,
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import Filter from '../Filter';
import styles from './index.module.scss';
import * as api from '../../../../api';
import * as utils from '../../../../utils';

const getData = (data) => {
  return data.map((v) => {
    return {
      group: v.group_name,
      id: v.uid,
      username: v.username,
      taskCount: v.completed_tasks,
      undoneCount: v.uncompleted_task,
      doneMoney: utils.formatMoney({
        money: v.paid_amount,
      }),
      undoneMoney: utils.formatMoney({
        money: v.unpaid_amount,
      }),
      date: utils.formatUnix({
        unix: v.create_time,
        fmt: 'Y-M-D h:m:s',
      }),
    };
  });
};

@withRouter
export default class MemberTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      current: 1,
      isLoading: false,
      data: [],
      count: 0,
      visible: false,
    };
    this.value = {
      group_id: 0,
      order: 'desc',
      orderby: 1,
      task_status: 2,
    };
  }

  componentDidMount() {
    this.fetchData(this.state.current);
  }

  fetchData = (page, page_size = 10) => {
    this.setState({
      isLoading: true,
    });

    api.getUsers(Object.assign({
      page,
      page_size,
    }, this.value)).then((res) => {
      const obj = {};
      if (this.state.groups.length === 0) {
        obj.groups = res.groups;
      }
      this.setState(Object.assign(obj, {
        count: res.count,
        data: getData(res.users),
      }));
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

  handleSettlement = (record) => {
    this.setState({
      visible: true,
    }, () => {
      this.money = 0;
      this.uid = record.id;
    });
  };

  handleBill = (record) => {
    this.props.history.push({
      pathname: '/turnover',
      state: {
        user: record,
      },
    });
  };

  handleAccount = (record) => {
    this.props.history.push({
      pathname: '/account/list',
      state: {
        user: record,
      },
    });
  };

  renderOper = (value, index, record) => {
    return (
      <div className={styles.btn}>
        <Button type="primary" onClick={this.handleSettlement.bind(this, record)}>
          结算
        </Button>
        <Button className={styles.marginLeft} type="primary" onClick={this.handleBill.bind(this, record)} >
          流水
        </Button>
        <Button className={styles.marginLeft} type="primary" onClick={this.handleAccount.bind(this, record)} >
          任务账号
        </Button>
      </div>
    );
  };

  handleFilterChange = (e) => {
    console.log(e);
    this.fetchData(this.state.current);
  };

  onOk = () => {
    if (!this.money || this.money <= 0) {
      Message.success('输入的金额不能为空或小于0');
      return;
    }

    this.setState({
      visible: false,
      isLoading: true,
    });

    api.pay({
      uid: this.uid,
      amount: utils.formatMoney({
        money: this.money,
        from: 'yuan',
        to: 'minute',
      }),
    }).then(() => {
      Message.success('结算成功');
      this.fetchData(this.state.current);
    }).catch((e) => {
      Message.success(e);
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  };

  onChange = (e) => {
    this.money = e;
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      isLoading,
      data,
      current,
      count,
      visible,
      groups,
    } = this.state;

    return (
      <div className={styles.container}>
        <Dialog
          visible={visible}
          footerAlign="center"
          onOk={this.onOk}
          onCancel={this.onClose}
          onClose={this.onClose}
        >
          <div className={styles.pair}>
            <div>请输入要结算的金额:</div>
            <div className={styles.picker}>
              <NumberPicker step={0.1} onChange={this.onChange} />
            </div>
          </div>
        </Dialog>
        <IceContainer>
          <Filter onChange={this.handleFilterChange} groups={groups} value={this.value} />
        </IceContainer>
        <IceContainer>
          <Table loading={isLoading} dataSource={data} hasBorder={false}>
            <Table.Column title="所属组别" dataIndex="group" />
            <Table.Column title="用户id" dataIndex="id" />
            <Table.Column title="用户名称" dataIndex="username" />
            <Table.Column title="累计完成任务" dataIndex="taskCount" />
            <Table.Column title="累计未完成任务" dataIndex="undoneCount" />
            <Table.Column title="累计已结算金额(元)" dataIndex="doneMoney" />
            <Table.Column title="累计未结算金额(元)" dataIndex="undoneMoney" />
            <Table.Column title="创建时间" dataIndex="date" />
            <Table.Column
              title="操作"
              width={200}
              dataIndex="oper"
              cell={this.renderOper}
            />
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