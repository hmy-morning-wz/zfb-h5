import React from 'react';

import { connect } from 'dva';
import { Button, List, WhiteSpace } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import Utils from '../../utils/Utils';

class AutoRechargeEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      siging: false,
    };
  }

  render() {
    const accountType = parseInt(this.props.location.query.accountType, 10);
    const cityConfig = global.ebusConfig.city;

    const autoConf = Utils.arrayFind(cityConfig.autoCharge, item => item.type === accountType);

    const onClickOpen = () => {
      this.setState({ siging: true });
      busService.signAndOpenAutoRecharge(accountType,
        autoConf.thresholdAmount,
        autoConf.chargeAmount).then(autoErrorPage(() => {
          this.setState({ siging: false });
          global.alert('TODO 签约');
        }));
    };

    return (
      <DocumentTitle title="自动充值">
        <div>
          <div>
            <List>
              <List.Item extra={`${Utils.formatRMBYuan(autoConf.thresholdAmount)}元`}>余额少于</List.Item>
              <List.Item extra={`${Utils.formatRMBYuan(autoConf.chargeAmount)}元`}>充值金额</List.Item>
            </List>
          </div>
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <div>
            <Button type="primary" onClick={onClickOpen}>立即开通</Button>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect()(AutoRechargeEditPage);
