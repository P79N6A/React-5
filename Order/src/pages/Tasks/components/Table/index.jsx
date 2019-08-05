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
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import Filter from '../Filter';
import styles from './index.module.scss';
import * as api from '../../../../api';
import * as utils from '../../../../utils';
import {
  platformType,
} from '../../../../baseData';

const getData = (data) => {
  return data.map((v) => {
    return {
      group: v.group_name,
      id: v.id,
      taskNo: v.No,
      platform: platformType[v.platform],
      type: v.name,
      url: v.url,
      price: utils.formatMoney({
        money: v.reward,
      }),
      number: v.applicant_num,
      remainder: v.remaining_applicant_num,
      date: utils.formatUnix({
        unix: v.create_time,
        fmt: 'Y-M-D h:m:s',
      }),
    };
  });
};

@withRouter
export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      isLoading: false,
      data: [],
      count: 0,
      groups: [],
    };
    this.value = {
      group_id: 0,
    };
  }

  componentDidMount() {
    this.fetchData(this.state.current);
  }

  fetchData = (page, page_size = 10) => {
    this.setState({
      isLoading: true,
    });

    api.getTasks(Object.assign({
      page,
      page_size,
    }, this.value)).then((res) => {
      const obj = {};
      if (this.state.groups.length === 0) {
        obj.groups = res.groups;
      }
      this.setState(Object.assign(obj, {
        count: res.pagination.count,
        data: getData(res.tasks),
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

  handleDetail = (e) => {
    this.props.history.push({
      pathname: '/task/details',
      state: {
        id: e.id,
      },
    });
  };

  renderOper = (value, index, record) => {
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: '5px' }}
          onClick={this.handleDetail.bind(this, record)}
        >
          进展
        </Button>
      </div>
    );
  };

  handleFilterChange = () => {
    this.fetchData(this.state.current);
  };

  render() {
    const {
      isLoading,
      data,
      current,
      count,
      groups,
    } = this.state;
    return (
      <div className={styles.container}>
        <IceContainer>
          <Filter onChange={this.handleFilterChange} value={this.value} groups={groups} />
        </IceContainer>
        <IceContainer>
          <Table loading={isLoading} dataSource={data} hasBorder={false}>
            <Table.Column title="所属组别" dataIndex="group" />
            <Table.Column title="任务编号" dataIndex="taskNo" />
            <Table.Column title="平台" dataIndex="platform" />
            <Table.Column title="类型" dataIndex="type" />
            <Table.Column title="链接" dataIndex="url" />
            <Table.Column title="单价(元)" dataIndex="price" />
            <Table.Column title="总量" dataIndex="number" />
            <Table.Column title="余量" dataIndex="remainder" />
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
            total={count}
            onChange={this.handlePaginationChange}
          />
        </IceContainer>
      </div>
    );
  }
}