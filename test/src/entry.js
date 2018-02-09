import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import styles from './index.less';

class App extends React.Component {
  render() {
    return (
      <div>
        <Button className={styles['my-btn']} type="primary">go</Button>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
