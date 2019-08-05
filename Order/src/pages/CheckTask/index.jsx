import React, { Component } from 'react';
import Table from './components/Table';
import PageHead from '../../components/PageHead';

export default class CheckTask extends Component {
  render() {
    return (
      <div>
        <PageHead
          title="审核任务"
        />
        <Table />
      </div>
    );
  }
}

