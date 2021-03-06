import React from 'react';

import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Card, WhiteSpace, WingBlank } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import busService from '../../services/busService';

import AccountType from '../../utils/AccountType';
import Utils from '../../utils/Utils';
import { autoErrorPage } from '../../utils/RequestHelper';
import { Loading } from '../../components';
import CardStatus from '../../utils/CardStatus';

import styles from './styles.less';

const buildTitle = (name, autoRecharge) => {
  return (
    <div>
      <div className={styles.blankBlue} />
      <span className={styles.accountTitleName}>{name}</span>
      {
        autoRecharge ? <span className={styles.autoRecharge}>自动充值</span> : ''
      }
    </div>
  );
};

const buildBalance = (text1, text2) => {
  return (
    <div>
      <span className={styles.topBalance}>{text1}</span>
      <WhiteSpace size="md" />
      <span className={styles.bigBalance}>{text2}</span>
    </div>
  );
};

const BuildTypes = {};
BuildTypes[AccountType.RECHARGE] = (accConfig, account, idx) => {
  const headerConfig = {
    title: buildTitle(accConfig.name, account.autoRechargeStatus),
    key: idx,
    extra: buildBalance('当前余额', `${Utils.formatRMBYuanDecimal(account.balance)}元`),
  };

  return (
    <Card key={idx} className={styles.card}>
      <Card.Header {...headerConfig} />
      <Card.Body>
        <div className={styles.descriptionBody}>{accConfig.memo}</div>
      </Card.Body>
    </Card>
  );
};

class BalancePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
    };
  }

  componentDidMount() {
    busService.getCard().then(autoErrorPage(this.props.dispatch, ({ data }) => {
      this.setState({ loading: false, data });
    }));
  }

  isCardActive() {
    const cardState = this.state.data;
    return cardState && cardState.status === CardStatus.ACTIVE;
  }

  render() {
    const ebusConfig = global.ebusConfig;

    const accounts = this.state.data ? this.state.data.accounts : [];

    const chargeOrder = ebusConfig.city.chargeOrder || [];

    const validOrders = chargeOrder.filter(tp => Utils.arrayFind(accounts, a => a.type === tp));

    const onRechargeGo = () => {
      this.props.dispatch(routerRedux.push({
        pathname: '/recharge',
        query: { cardId: this.state.data.cardId },
      }));
    };

    const showRechargeLog = () => {
      this.props.dispatch(routerRedux.push('/rechargeLog'));
    };

    const buildChargeOrder = () => {
      if (validOrders.length > 1) {
        return (
          <div id="扣款顺序" className={styles.balSort}>
            扣款顺序:
            {validOrders.map((tp, idx) => {
              const accConfig = Utils.getAccountByType(tp);
              const notLast = idx !== validOrders.length - 1;
              return (
                <span key={idx}>
                  <em>{accConfig.name}</em>
                  { notLast ? ' >' : ''}
                </span>
              );
            })}
          </div>
        );
      } else {
        return '';
      }
    };

    return (
      <DocumentTitle title="电子钱包">
        <Loading loading={this.state.loading}>
          <div name="ALL">
            <WingBlank size="lg">              
              <div className={styles.clearLine} />
              <WhiteSpace size="lg" />
              <div name="余额列表" className={styles.acctList}>
                { accounts.map((acc, idx) => {
                  if (acc.type === AccountType.RECHARGE) {
                    const func = BuildTypes[acc.type] || BuildTypes[AccountType.RECHARGE];
                    const accConfig = Utils.getAccountByType(acc.type) || {};
                    return (
                      <div key={idx}>
                        {func(accConfig, acc, idx)}
                        <WhiteSpace size="lg" />
                      </div>
                    );
                  }
                })}
                <div className={styles.alipayCard}>                  
                </div>
                <div>
                  <WhiteSpace size="lg" />
                  <Button type="primary" disabled={!this.isCardActive()} onClick={onRechargeGo}>立即充值</Button>
                  <WhiteSpace size="lg" />
                </div>
              </div>
            </WingBlank>
            <div title="充值按钮" className={styles.footer}>
              <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <a style={{color: '#108ee9'}} onClick={showRechargeLog}>充值记录</a>
                <WhiteSpace size="lg" />
              </WingBlank>
            </div>
          </div>

        </Loading>
      </DocumentTitle>
    );
  }
}

export default connect()(BalancePage);
