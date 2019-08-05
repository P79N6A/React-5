import React, {
  Component,
} from 'react';
import {
  Table,
  Pagination,
  Message,
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import Zmage from 'react-zmage';
import styles from './index.module.scss';
import * as api from '../../api';
import * as utils from '../../utils';

const getData = (data) => {
  return data.map((v) => {
    return {
      id: v.uid,
      username: v.username,
      date: utils.formatUnix({
        unix: v.time,
        fmt: 'Y-M-D h:m:s',
      }),
      screenShot: v.submit_url ? v.submit_url : [],
    };
  });
};

export default class TaskProgress extends Component {
  constructor(props) {
    super(props);
    const {
      id,
      info,
    } = this.props.location.state;
    this.info = info;
    this.taskId = id;
    this.state = {
      current: 1,
      isLoading: false,
      data: [],
      count: 0,
    };
  }

  componentDidMount() {
    this.fetchData(this.state.current);
  }

  fetchData = (page, page_size = 10) => {
    this.setState({
      isLoading: true,
    });

    api.getTaskApplicants({
      page,
      page_size,
      tab: this.info.tab,
      task_id: this.taskId,
    }).then((res) => {
      this.setState({
        count: res.pagination.count,
        data: getData(res.applicants),
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

  renderCover = (value, index, record) => {
    const setUrls = record.screenShot.map((v) => {
      return {
        src: v,
      };
    });
    const urls = record.screenShot.map((v, key) => {
      return (
        <Zmage
          key={key}
          width={100}
          height={75}
          src={v}
          set={setUrls}
          defaultPage={index}
          style={{ border: '1px solid #ccc', margin: '4px' }}
        />
      );
    });
    return (<div>{urls}</div>);
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
            <Table.Column title="用户id" dataIndex="id" />
            <Table.Column title="用户名称" dataIndex="username" />
            {this.info.tab === 1 ? null : <Table.Column title="提交截图" cell={this.renderCover} />}
            <Table.Column title={this.info.name} dataIndex="date" />
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