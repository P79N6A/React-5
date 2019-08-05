import React, {
  Component,
} from 'react';
import Table from './components/Table';
import PageHead from '../../components/PageHead';

export default class Turnover extends Component {
  render() {
    return (
      <div>
        <PageHead title="流水账单" />
        <Table />
      </div>
    );
  }
}