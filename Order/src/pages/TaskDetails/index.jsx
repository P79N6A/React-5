import React, {
  Component,
} from 'react';
import {
  Tab,
} from '@alifd/next';
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import PageHead from '../../components/PageHead';
import {
  taskTabsConfig,
} from '../../baseData';

@withRouter
export default class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.id = this.props.location.state.id;
  }

  componentDidMount() {
    this.jump({
      path: taskTabsConfig[0].path,
      info: taskTabsConfig[0].info,
    });
  }

  handleClick = (e) => {
    this.jump({
      path: e.path,
      info: e.info,
    });
  };

  jump({
    path,
    info,
  }) {
    this.props.history.replace({
      pathname: path,
      state: {
        id: this.id,
        info,
      },
    });
  }

  render() {
    const {
      location,
    } = this.props;
    const {
      pathname,
    } = location;
    return (
      <div>
        <PageHead
          title="任务进展"
        />
        <div>
          <Tab activeKey={pathname} >
            {taskTabsConfig.map((item) => {
              return (
                <Tab.Item key={item.path} title={item.tab} onClick={this.handleClick.bind(this, item)}>
                </Tab.Item>);
              })
            }
          </Tab>
          <div style={{ marginTop: '20px' }}>
            <Switch>
              {
                taskTabsConfig.map((v, index) => {
                  return (
                    <Route key={index} path={v.path} component={v.component} />
                  );
                })
              }
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}