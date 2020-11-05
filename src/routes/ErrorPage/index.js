import React from 'react';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Button, Result, Icon, WhiteSpace } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';


import styles from './styles.less';

const HOME_PAGE = '/main';

class ErrorPage extends React.Component {

  componentDidMount() {
    global.ap && global.ap.hideLoading();
  }

  render() {
    const { code, message, backPage } = this.props.location.query;
    const goPage = backPage || HOME_PAGE;

    const onClick = () => {
      this.props.dispatch(routerRedux.replace(goPage));
    };

    const buildResult = () => {
      if (code === '10024') {
        return (
          <Result
            img={<Icon type={require('../../svg/Warning.svg')} className={styles.icon} style={{ fill: '#FFC107' }} />}
            title=""
            message={message}
          />
        );
      } else {
        return (
          <Result
            img={<Icon type="cross-circle-o" className={styles.icon} style={{ fill: '#F13642' }} />}
            title={`错误码: ${code}`}
            message={message}
          />
        );
      }
    };

    const info = global.ebusConfig.city;

    return (
      <DocumentTitle title={info.cardName}>
        <div>
          {buildResult()}
          <WhiteSpace />
          <Button onClick={onClick}>返回</Button>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect()(ErrorPage);
