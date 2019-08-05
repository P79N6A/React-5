import React, {
  Component,
} from 'react';
import Table from './components/Table';
import PageHead from '../../components/PageHead';

export default class AccountList extends Component {
  render() {
    return (
      <div>
        <PageHead title="任务账号" />
        <Table />
      </div>
    );
  }
}