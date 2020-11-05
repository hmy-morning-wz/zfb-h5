import React from 'react';

import { connect } from 'dva';

import { WhiteSpace, WingBlank } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import Utils from '../../utils/Utils';
import TravelStatus from '../../utils/TravelStatus';

import styles from './styles.less';

const TravelDetailPage = (data) => {
  const info = global.ebusConfig.city;
  return (
    <DocumentTitle title="乘车详情">
      <div className={styles.bg}>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          <div className={styles.title} >
            <img src={info.iconUrl} alt="IMG" />
            {data.subject}
          </div>
          <div className={styles.amount}> -{Utils.formatRMBYuan(data.deductedAmt)} </div>
          <div className={styles.orderstate}>{TravelStatus.toName(data.status)} </div>
          <div>
            <ul className={styles.line}>
              <li>流水号 <span>{data.seqNo}</span></li>
              <li>电子卡号 <span>{data.cardId}</span></li>
              {
                (data.chargeName && data.chargeName != null) ? <li>计费类型 <span>{data.chargeName}</span></li> : ''
              }
              {
                (data.ammount && data.ammount != null) ? <li>票价 <span>{Utils.formatRMBYuan(data.ammount)}元</span></li> : '' 
              }
              {
                (data.accountTypeName && data.accountTypeName != null) ? <li>支付渠道 <span>{data.accountTypeName}</span></li> : ''
              }
              {
                (data.alipayOrderNo && data.alipayOrderNo != null) ? <li>支付单号 <span>{data.alipayOrderNo}</span></li> : ''
              }
              <li>乘车时间 <span>{data.gmtBizTime}</span></li>
              {
                (data.lineName && data.lineName != null) ? <li>公交线路 <span>{data.lineName}</span></li> : ''
              }
              {
                (data.startStationName && data.startStationName != null) ? <li>上车站点 <span>{data.startStationName}</span></li> : ''
              }
              {
                (data.endStationName && data.endStationName != null) ? <li>下车站点 <span>{data.endStationName}</span></li> : ''
              }

              {
                (data.info && data.info != null) ? <li>车辆信息 <span>{data.info}</span></li> : ''
              }
              {
                (data.driverId && data.driverId != null) ? <li>设备ID <span>{data.driverId}</span></li> : ''
              }
            </ul>
            <div className={styles.clearLine} />
          </div>
        </WingBlank>
      </div>
    </DocumentTitle>
  );
};

const mapStateToProps = (state) => {
  return state.ebuscard.travelDetail;
};

export default connect(mapStateToProps)(TravelDetailPage);
