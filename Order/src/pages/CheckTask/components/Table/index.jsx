import React, {
  Component,
} from 'react';
import {
  Table,
  Pagination,
  Button,
  Message,
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import Zmage from 'react-zmage';
import styles from './index.module.scss';
import * as api from '../../../../api';
import * as utils from '../../../../utils';
import {
  platformType,
} from '../../../../baseData';

const getData = (data) => {
  return data.map((v) => {
    return {
      id: v.applicant_id,
      nickname: v.username,
      taskId: v.task_id,
      taskNo: v.task_no,
      platform: platformType[v.platform],
      type: v.task_name,
      direction: v.desc,
      screenShot: v.submit_url,
      applicant_id: v.applicant_id,
      date: utils.formatUnix({
        unix: v.apply_time,
        fmt: 'Y-M-D h:m:s',
      }),
    };
  });
};

export default class CheckTaskTable extends Component {
  constructor(props) {
    super(props);
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
    api.getReviewTasks({
      page,
      page_size,
    }).then((res) => {
      this.setState({
        count: res.count,
        data: getData(res.tasks),
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

  handleApproved = (e) => {
    this.setReviewResult({
      applicantId: e.applicant_id,
      reviewResult: 4,
    });
  };

  handleRefuse = (e) => {
    this.setReviewResult({
      applicantId: e.applicant_id,
      reviewResult: 5,
    });
  };

  setReviewResult({
    applicantId,
    reviewResult,
  }) {
    this.setState({
      isLoading: true,
    });
    api.reviewTasks({
      applicant_id: applicantId,
      review_result: reviewResult,
    }).then(() => {
      this.fetchData(this.state.current);
    }).catch((e) => {
      Message.success(e);
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  renderOper = (value, index, record) => {
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: '5px' }}
          onClick={this.handleApproved.bind(this, record)}
        >
          通过
        </Button>
        <Button type="normal" onClick={this.handleRefuse.bind(this, record)}>
          未达标
        </Button>
      </div>
    );
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
            <Table.Column title="用户" dataIndex="nickname" />
            <Table.Column title="任务编号" dataIndex="taskNo" />
            <Table.Column title="平台" dataIndex="platform" />
            <Table.Column title="类型" dataIndex="type" />
            <Table.Column title="方向" dataIndex="direction" />
            <Table.Column title="提交截图" cell={this.renderCover} />
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