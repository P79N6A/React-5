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
  Select,
} from '@alifd/next';
import IceContainer from '@icedesign/container';
import Filter from '../Filter';
import styles from './index.module.scss';
import * as api from '../../../../api';
import * as utils from '../../../../utils';

const getData = (data) => {
  return data.map((v) => {
    const awards = getAward(v.awards);
    return {
      id: v.uid,
      username: v.username,
      task: v.task_num,
      money: utils.formatMoney({
        money: v.income,
      }),
      excellent: awards[awardConfig.excellent],
      positive: awards[awardConfig.positive],
      encourage: awards[awardConfig.encourage],
    };
  });
};

const awardConfig = {
  excellent: 1, // 优秀奖
  positive: 3, // 积极奖
  encourage: 2, // 鼓励奖
};

const getAward = (awards) => {
  const obj = {
    1: '',
    2: '',
    3: '',
  };
  if (awards.length === 0) {
    return obj;
  }
  awards.forEach((v) => {
    obj[v.type] = gradeData[v.level];
  });
  return obj;
};

const gradeData = {
  1: '一档',
  2: '二档',
  3: '三档',
  4: '四档',
};

const getGrade = (type) => {
  switch (type) {
    case 1:
      return [{
        label: '一档',
        value: '1',
      }, {
        label: '二档',
        value: '2',
      }];
    case 3:
      return [{
        label: '一档',
        value: '1',
      }, {
        label: '二档',
        value: '2',
      }, {
        label: '三档',
        value: '3',
      }, {
        label: '四档',
        value: '4',
      }];
    case 2:
      return [{
        label: '一档',
        value: '1',
      }];
    default:
      return {};
  }
};

@withRouter
export default class RankTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      visible: false,
      isLoading: false,
      showBtn: false,
      data: [],
      count: 0,
      rowSelection: null,
    };
    this.value = {
      month: '1',
      order_field: '1',
    };
  }

  componentDidMount() {
    this.fetchData(this.state.current);
  }

  fetchData = (page, page_size = 10) => {
    this.setState({
      isLoading: true,
    });

    api.getRanks(Object.assign({
      page,
      page_size,
    }, this.value)).then((res) => {
      this.setState({
        count: res.pagination.count,
        data: getData(res.ranking),
        rowSelection: {
          selectedRowKeys: [],
          onChange: this.onChange,
        },
      });
    }).catch((e) => {
      Message.success(e);
      this.setState({
        count: 0,
        data: [],
        rowSelection: {
          selectedRowKeys: [],
        },
      });
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  };

  handlePaginationChange = (current) => {
    this.setState({
      current,
      data: [],
    }, () => {
      this.fetchData(current);
    });
  };

  handleFilterChange = (e) => {
    this.setState({
      showBtn: e.month === '2' ? true : false,
    });

    this.fetchData(this.state.current);
  };

  award = (type) => {
    const {
      selectedRowKeys,
    } = this.state.rowSelection;

    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      Message.success('勾选不能为空');
      return;
    }

    if (selectedRowKeys.length > 5) {
      Message.success('最多同时授予5个');
      return;
    }

    this.setState({
      visible: true,
      grade: getGrade(type),
    }, () => {
      this.type = type;
    });
  };

  onChange = (ids) => {
    const {
      rowSelection,
    } = this.state;
    rowSelection.selectedRowKeys = ids;
    this.setState({
      rowSelection,
    });
  }

  clear() {
    const {
      rowSelection,
    } = this.state;
    rowSelection.selectedRowKeys = [];
    this.setState({
      rowSelection,
    });
  }

  onOk = () => {
    if (!this.level) {
      Message.success('选择的档次不能为空');
      return;
    }

    const {
      selectedRowKeys,
    } = this.state.rowSelection;

    this.setState({
      visible: false,
      isLoading: true,
    });

    api.award({
      uids: selectedRowKeys,
      type: this.type,
      level: parseInt(this.level, 10),
    }).then(() => {
      Message.success('授予成功');
      this.clear();
      this.fetchData(this.state.current);
    }).catch((e) => {
      Message.success(e);
      this.level = 0;
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  gradeChange = (e) => {
    this.level = e;
  };

  render() {
    const {
      visible,
      grade,
      isLoading,
      showBtn,
      data,
      current,
      count,
      rowSelection,
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
            <div>请选择档次:</div>
            <div className={styles.picker}>
              <Select dataSource={grade} onChange={this.gradeChange} />
            </div>
          </div>
        </Dialog>
        <IceContainer>
          <Filter
            onChange={this.handleFilterChange}
            value={this.value}
          />
        </IceContainer>
        <IceContainer>
          {showBtn ? <p>
            <Button onClick={this.award.bind(this, awardConfig.excellent)}>授予优秀奖</Button>&nbsp;
            <Button onClick={this.award.bind(this, awardConfig.positive)}>授予积极奖</Button>&nbsp;
            <Button onClick={this.award.bind(this, awardConfig.encourage)}>授予鼓励奖</Button>&nbsp;
            </p> : null}
          <Table
            loading={isLoading}
            dataSource={data}
            hasBorder={false}
            rowSelection={showBtn ? rowSelection : null}
          >
            <Table.Column title="用户id" dataIndex="id" />
            <Table.Column title="用户名" dataIndex="username" />
            <Table.Column title="累计完成任务" dataIndex="task" />
            <Table.Column title="累计金额(元)" dataIndex="money" />
            {showBtn ? [{
                title: '优秀奖',
                dataIndex: 'excellent',
              }, {
                title: '积极奖',
                dataIndex: 'positive',
              }, {
                title: '鼓励奖',
                dataIndex: 'encourage',
              }].map((v) => {
                return (<Table.Column key={v.dataIndex} title={v.title} dataIndex={v.dataIndex} />);
              }) : null
            }
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