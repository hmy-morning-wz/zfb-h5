import React from 'react';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Button, Modal, Result, Icon, WhiteSpace, WingBlank } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import CardStatus from '../../utils/CardStatus';

import styles from './styles.less';

class UnregisteringPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {      
      data: null,
    };
  }

  canRollback() {
    const cardState = this.state.data;    
    return cardState 
      && cardState.status !== CardStatus.UNREGISTED 
      && cardState.status !== CardStatus.FROZEN 
      && cardState.status !== CardStatus.REFUNDING;
  }

  componentDidMount() {
    busService.getCard().then(autoErrorPage(this.props.dispatch, ({ data }) => {
      this.setState({ data });      
    }, '/'));
  }

  render() {
    const dispatch = this.props.dispatch;
    const info = global.ebusConfig.city;
    const doRollback = () => {
      busService.rollbackUnregister().then(autoErrorPage(dispatch, () => {
        const alertInstance = Modal.alert('撤回成功!', '你可以继续使用公交付款服务', [
          {
            text: '立即查看',
            onPress: () => {
              dispatch(routerRedux.replace('/main'));
              alertInstance.close();
            },
          },
        ]);
      }));
    };

    return (
      <DocumentTitle title="退卡申请">
        <div>
          <Result
            img={<Icon type="check-circle" className={styles.icon} style={{ fill: '#1F90E6' }} />}
            title="退卡申请"
            message={`${info.unRegisterMemo ? info.unRegisterMemo : '我们将尽快审核您的申请，申请成功后卡内余额将退回您支付宝账户'}`}
          />
          <WhiteSpace />
          <WingBlank size="lg">
            <Button onClick={doRollback} type="ghost" disabled={!this.canRollback()} > 撤回申请</Button>
          </WingBlank>
        </div>

      </DocumentTitle>
    );
  }
}

export default connect()(UnregisteringPage);
