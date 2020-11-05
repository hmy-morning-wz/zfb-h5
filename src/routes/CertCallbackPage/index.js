import React from 'react';

import { connect } from 'dva';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';


import busService from '../../services/busService';
import CertType from '../../utils/CertType';
import { autoErrorPage } from '../../utils/RequestHelper';

import { Loading } from '../../components';

class CertCallbackPage extends React.Component {
  constructor(props) {
    super(props);
    const q = this.props.location.query;
    let mode = CertType.REAL_NAME;
    let requestId;
    let authCode;
    let isCreditOpened;

    if ('request_id' in q) {
      requestId = q.request_id;
      authCode = q.auth_code;
      mode = CertType.REAL_NAME;
    } else if ('isCreditOpened' in q) {
      mode = CertType.ALIPAY_CREDIT;
      isCreditOpened = q.isCreditOpened;
    }

    this.state = {
      loading: true,
      mode,
      requestId,
      authCode,
      isCreditOpened,
    };
  }

  componentDidMount() {
    this.doRegister();
  }

  doRegister() {
    let param = {};
    switch (this.state.mode) {
      case CertType.REAL_NAME:
        param = { requestId: this.state.requestId, authCode: this.state.authCode };
        break;
      case CertType.ALIPAY_CREDIT:
        param = { isCreditOpened: this.state.isCreditOpened };
        break;
      default:
        break;
    }

    busService.register(param).then(autoErrorPage(this.props.dispatch, ({data}) => {
      this.setState({
        loading: false
      });
      if (data.alipayMiniappUrl) {
        // 跳转小程序
        AlipayJSBridge.call('pushWindow', {
          url : data.alipayMiniappUrl
        })
        AlipayJSBridge.call('popWindow')
      } else {
        // 跳转卡详情
        this.props.dispatch({ type: 'ebuscard/showNewOpen', payload: { page: '/main' } })
      }
    }, '/'));
  }

  render() {
    const info = global.ebusConfig.city;

    return (
      <DocumentTitle title={info.cardName}>
        <Loading loading={this.state.loading} />
      </DocumentTitle>
    );
  }
}

export default connect()(CertCallbackPage);
