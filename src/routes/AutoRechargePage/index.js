import React from 'react';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, WhiteSpace } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import { Loading } from '../../components';

import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import Utils from '../../utils/Utils';

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

class AutoRechargePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      processing: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  onClickButton(acc, autoConfig) {
    if (acc.active) {
      this.props.dispatch(routerRedux.push({
        pathname: 'autoRechargeEdit',
        query: { accountType: acc.type },
      }));
    } else {
      this.setState({ processing: true });

      busService.signAndOpenAutoRecharge(acc.type,
        autoConfig.thresholdAmount,
        autoConfig.chargeAmount)
        .then(autoErrorPage(this.props.dispatch, () => {
          this.setState({ processing: false });
          this.load();
        }));
    }
  }

  load() {
    this.setState({ loading: true });
    busService.getAutoRechargeStatus().then(autoErrorPage(this.props.dispatch, ({ data }) => {
      this.setState({
        loading: false,
        data,
      });
    }));
  }

  render() {
    const data = this.state.data;
    const accounts = data && data.list ? data.list : [];

    const cityConfig = global.ebusConfig.city;

    const getConfigByType = (tp) => {
      return Utils.arrayFind(cityConfig.autoCharge, item => item.type === tp);
    };

    return (
      <DocumentTitle title="自动充值">
        <Loading loading={this.state.loading}>
          <div className={styles.box}>
            <WhiteSpace size="lg" />
            <span className={styles.notice}>请选择需要管理自动充值的卡片类型</span>
            <WhiteSpace size="lg" />
            <div name="自动充值列表" className={styles.acctList}>
              { accounts.map((acc, idx) => {
                const autoConfig = getConfigByType(acc.type);
                const accConfig = Utils.getAccountByType(acc.type);

                const headerConfig = {
                  title: buildTitle(accConfig.name),
                  extra: (acc.active ? '已开通' : ''),
                };

                const footer = (
                  <div className={styles.cardButtonOuter}>
                    <hr />
                    <a
                      className={styles.cardButton}
                      onClick={() => this.onClickButton(acc, autoConfig)}
                    >
                      {acc.active ? '编辑' : '立即开通'}
                    </a>
                  </div>
                );

                return (
                  <div key={idx}>
                    <Card>
                      <Card.Header {...headerConfig} />
                      <Card.Body className={styles.cardDescription}>
                        {autoConfig.memo}
                      </Card.Body>
                      <Card.Footer content={footer} />
                    </Card>
                    <WhiteSpace />
                  </div>
                );
              })}
            </div>
          </div>

        </Loading>
      </DocumentTitle>
    );
  }
}

export default connect()(AutoRechargePage);
