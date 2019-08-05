import React, {
  Component,
} from 'react';
import Table from './components/Table';
import PageHead from '../../components/PageHead';

export default class Tasks extends Component {
  render() {
    return (
      <div>
        <PageHead
          title="任务管理"
        />
        <Table />
      </div>
    );
  }
}