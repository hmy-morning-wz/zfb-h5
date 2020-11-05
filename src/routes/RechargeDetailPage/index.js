import React from 'react';

import { connect } from 'dva';

import { WhiteSpace, WingBlank } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import Utils from '../../utils/Utils';
import PayStatus from '../../utils/PayStatus';
import styles from './styles.less';

const RechargeDetailPage = (data) => {
  const accConfig = Utils.getAccountByType(data.accountType);

  const buildDetails = () => {
    return (
      <div className={styles.list}>
        <ul className={styles.line}>
          <li>充值类型 <span>{accConfig ? accConfig.name : `未知-${data.accountType}`} </span></li>
          <li>充值卡号 <span>{data.cardId}</span></li>
          <li>充值订单号 <span>{data.orderId.toLowerCase()}</span></li>
          <li>支付单号 <span>{data.payOrderId}</span></li>
          <li>充值时间 <span>{data.gmtCreate}</span></li>
        </ul>
        <div className={styles.clearLine} />
      </div>
    );
  };

  return (
    <DocumentTitle title="充值详情">
      <div className={styles.bg}>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          <div className={styles.title}> {Utils.formatRMBYuanDecimal(data.rechargeAmmount)} 元 </div>
          <div className={styles.orderstate}>{PayStatus.toName(data.status)}</div>
          <div>
            {
              // data.status === 1 ? buildDetails() : '订单处理中'
              buildDetails()
            }
          </div>
        </WingBlank>
      </div>
    </DocumentTitle>
  );
};

const mapStateToProps = (state) => {
  return state.ebuscard.rechargeDetail;
};

export default connect(mapStateToProps)(RechargeDetailPage);
