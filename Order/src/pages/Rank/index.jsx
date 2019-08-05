import React, { Component } from 'react';
import Table from './components/Table';
import PageHead from '../../components/PageHead';

export default class Rank extends Component {
  render() {
    return (
      <div>
        <PageHead
          title="排行榜"
        />
        <Table />
      </div>
    );
  }
}
