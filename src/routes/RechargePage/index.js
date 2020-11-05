import React from 'react';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Button, Picker, List, WhiteSpace, WingBlank, Toast } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import AccountType from '../../utils/AccountType';
import { Loading } from '../../components';

import busService from '../../services/busService';
import Utils from '../../utils/Utils';
import { autoErrorPage } from '../../utils/RequestHelper';
import globalConfig from '../../utils/config';
import styles from './styles.less';

const wrapListValue = (text) => {
  return (<span className={styles.basicInfoValue}>{text}</span>);
};

const toastMsg = (msg) => {
	return (
		<div className={styles.toastDiv}>
			{msg}
		</div>
	);
};

class RechargePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      selectedTypeIdx: null,
      selectedPriceIdx: -1,
      rechargeLimit: globalConfig.quota,

      recharging: false,
    };
  }

  componentDidMount() {
    if (global.ap) {
      global.ap.allowPullDownRefresh(false);
    }
    const dispatch = this.props.dispatch;

    busService.getCard().then(autoErrorPage(dispatch, (resp) => {
      const myAccounts = resp.data.accounts || [];

      busService.getRechargeConfig().then(autoErrorPage(this.props.dispatch, ({ data }) => {
        const rechargeableList = data.list.filter((item) => {
          return item.rechargeable && Utils.arrayFind(myAccounts, acc => acc.type === item.type);
        });

        const selectedTypeIdx = rechargeableList.length > 0 ? 0 : -1;        
        this.setState({
          loading: false,
          data,
          rechargeLimit: data.upperLimitAmount || globalConfig.quota,
          card: resp.data,
          selectedPriceIdx: -1,
          selectedTypeIdx,
          rechargeableList,
        });
      }));
    }));
  }

  onTypeChanged([idx]) {
    this.setState({
      selectedTypeIdx: idx,
      selectedPriceIdx: -1,
    });
  }

  render() {
    const cardId = this.state.card ? this.state.card.cardId : '-';
    const rechargeableList = this.state.rechargeableList || [];

    const rechargeTypes = rechargeableList.map((item, idx) => {
      return { label: item.name, value: idx };
    });

    let typeItem = rechargeableList[this.state.selectedTypeIdx];

    if (!typeItem) {
      typeItem = {
        id: '',
        list: [],
      };
    }

    let rechargeBalance = 0.00;
    this.state.card && this.state.card.accounts.map((acc, index) => {
      if (acc.type === AccountType.RECHARGE) {
        rechargeBalance = acc.balance;
      }
    });

    let ableAmt = this.state.rechargeLimit - rechargeBalance;
    ableAmt = ableAmt < 0 ? 0 : ableAmt;

    const selectedPrice = typeItem.list[this.state.selectedPriceIdx];
    
    const onSelectPrice = (idx) => {
      const selectedAmt = typeItem.list[idx];	
			if (selectedAmt.value > ableAmt) {
				Toast.info(toastMsg('超出最高金额限制'));
			} else {
				this.setState({ selectedPriceIdx: idx });
			}      
    };

    const onClickPay = () => {
      this.setState({ recharging: true });

      busService.recharge(typeItem.type, selectedPrice.value)
        .then(autoErrorPage(this.props.dispatch, ({ data }) => {
          this.setState({ recharging: false });
          // global.open(data.payUrl);
          global.location.href = data.payUrl;
        }));
    };

    return (
      <DocumentTitle title="充值" className={styles.win}>
        <Loading loading={this.state.loading} >
          <div id="listView">
            <List>
              <List.Item extra={wrapListValue(cardId)} arrow="empty">充值卡号</List.Item>
              <Picker title="充值类型" cols={1} data={rechargeTypes} onOk={this.onTypeChanged.bind(this)} value={[this.state.selectedTypeIdx]}>
                <List.Item arrow="horizontal">充值类型</List.Item>
              </Picker>
            </List>
          </div>
          <WhiteSpace className={styles.space} size="md" />
          <div className={styles.pricebg}>
            <WingBlank size="md" >
              <div className={styles.tips}>{typeItem.memo}</div>
              <div>
                {typeItem.list.map((item, idx) => {
                  const selected = idx === this.state.selectedPriceIdx;
                  const classNames = item.value > ableAmt ? `${styles.priceRect} ${styles.diabledAmt}` : 
                                      `${styles.priceRect} ${selected && styles.selected}`;
                  return (
                    <div key={idx} className={classNames} onClick={() => onSelectPrice(idx)}>
                      {Utils.formatRMBYuan(item.value)}元
                      </div>
                  );
                })}
              </div>
              <div className={styles.clearLine} />
            </WingBlank>
            <div className={styles.tipDiv}>
							当前余额<span className={styles.amt}>{Utils.formatRMBYuanDecimal(rechargeBalance)}</span>元，
							最多还可充<span className={styles.amt}>{Utils.formatRMBYuanDecimal(ableAmt)}</span>元
						</div>
            <div className={styles.fixButtom}>
              <div>
                <Button type="primary" disabled={selectedPrice == null || this.state.recharging} onClick={onClickPay}>
                  确认支付
                </Button>
              </div>
              <div className={styles.buttom_links}>
                <a onClick={() => global.alert('功能建设中')}>自动充值 </a>
                  |
                <a onClick={() => this.props.dispatch(routerRedux.push('/rechargeLog'))}> 充值记录</a>
              </div>
              <WhiteSpace size="md" />
            </div>
          </div>
        </Loading>
      </DocumentTitle>
    );
  }
}

export default connect()(RechargePage);
