import React from 'react';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Button, Result, Icon, WhiteSpace } from 'antd-mobile';
import config from '../../utils/config';
import busService from '../../services/busService';

import { basicResponseHandler, makeBusQRUrl } from '../../utils/RequestHelper';
import { STATUS_OK } from '../../utils/request';
import PayStatus from '../../utils/PayStatus';


import styles from './styles.less';

class PayResultPage extends React.Component {
  constructor(props) {
    super(props);

    const orderId = this.props.location.query.outTradeNo;

    this.state = {
      lastQueryTime: new Date().getTime(),
      tried: 0,
      orderId,
      errors: [],

      result: PayStatus.UNPAY,
    };
    // 注意：如果自定义了back，并使用了location.href去跳到指定的地址，需要包装一个setTimeout以保证不会阻塞客户端线程。
    global.document.addEventListener('back', (e) => {
      e.preventDefault();
      setTimeout(() => {
        this.props.dispatch(routerRedux.replace('/'));
      }, 10);
    }, false);
  }

  componentDidMount() {
    global.ap && global.ap.hideLoading();
    this.scheduleQueryNext();
  }

  doQuery() {
    busService.queryPay(this.state.orderId)
    .then(basicResponseHandler(({ code, msg, data }) => {
      if (code !== STATUS_OK) {
        const errors = this.state.errors;

        errors.push({ code, message: msg });

        this.scheduleQueryNext();
      } else {
        this.setState({ result: data.result, cardNo: data.cardNo });
        // debugger;
        switch (data.result) {
          case PayStatus.UNPAY:
            this.scheduleQueryNext();
            break;
          case PayStatus.SUCCESS:
            // DONE
            break;
          case PayStatus.ERROR:
            // DOWN
            break;
          case PayStatus.REFUND:
              // DOWN
            break;
          default:
            this.props.dispatch(routerRedux.replace({
              pathname: '/error',
              query: {
                message: `无效的支付结果： ${data.result}`,
                code: -1,
                back: '/main',
              },
            }));
        }
      }
    }));
  }

  scheduleQueryNext() {
    const tried = this.state.tried;
    const now = new Date().getTime();
    if (tried < config.payQueryMaxCount) {
      this.setState({ tried: tried + 1, lastQueryTime: now });

      const elapsed = Math.max(0, now - this.state.lastQueryTime) / 1000;

      if (elapsed > config.payQueryDuration) {
        this.doQuery();
      } else {
        const nextMillis = (config.payQueryDuration - elapsed) * 1000;
        global.setTimeout(this.doQuery.bind(this), nextMillis);
      }
    }
  }

  render() {
    const buildPaying = () => {
      return (
        <div>
          <Result
            img={<Icon type="loading" className={styles.icon} style={{ fill: '#1F90E6' }} />}
            title="处理中"
            message="订单正在处理中，请耐心等待."
          />
          <WhiteSpace />
        </div>

      );
    };

    const buildFailed = () => {
      return (
        <div>
          <Result
            img={<Icon type="cross-circle-o" className={styles.icon} style={{ fill: '#F13642' }} />}
            title="充值失败"
            message="充值失败，请稍后重试."
          />
          <WhiteSpace />
        </div>
      );
    };

    const buildRefund = () => {
      return (
        <div>
          <Result
            img={<Icon type="check-circle" className={styles.icon} style={{ fill: '#FFDC00' }} />}
            title="已退款"
            message="因充值失败，您的订单已退款。"
          />
          <WhiteSpace />
        </div>
      );
    };
    const info = global.ebusConfig.city;
    const onUseClick = () => {
      const url = makeBusQRUrl(info.cityCode, this.state.cardNo,
        info.alipayCardType, info.alipaySource);
      global.open(url);
    };

    const buildSuccess = () => {
      return (
        <div>
          <Result
            img={<Icon type="check-circle" className={styles.icon} style={{ fill: '#1F90E6' }} />}
            title="充值成功"
            message="充值成功，您可以立即扫码上车。"
          />
          <WhiteSpace />
          <Button onClick={onUseClick} >扫码上车</Button>
        </div>
      );
    };

    const timeout = this.state.tried >= config.payQueryMaxCount;
    if (timeout) {
      return (
        <div>
          <Result
            img={<Icon type="check-circle" className={styles.icon} style={{ fill: '#FFDC00' }} />}
            title="系统繁忙"
            message="您的订单正在后台处理中，请稍后再来查询确认."
          />
          <WhiteSpace />
        </div>
      );
    } else {
      switch (this.state.result) {
        case PayStatus.UNPAY:
          return buildPaying();
        case PayStatus.ERROR:
          return buildFailed();
        case PayStatus.SUCCESS:
          return buildSuccess();
        case PayStatus.REFUND:
          return buildRefund();
        default:
          return (
            <div>
              UNKOWN result: {this.state.result}
            </div>
          );
      }
    }
  }
}

export default connect()(PayResultPage);
