import React, { Component } from 'react';
import Table from './components/Table';
import PageHead from '../../components/PageHead';

export default class Membership extends Component {
  render() {
    return (
      <div>
        <PageHead title="用户管理" />
        <Table />
      </div>
    );
  }
}
