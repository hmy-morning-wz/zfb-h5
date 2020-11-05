
import React from 'react';

import { connect } from 'dva';

import { DatePicker, List } from 'antd-mobile';
import moment from 'moment';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import Utils from '../../utils/Utils';
import config from '../../utils/config';

import { Loading } from '../../components';

import styles from './styles.less';

const PAGE_SIZE = 10;

class RechargeListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,

      list: [],

      month: moment(),
      page: 1,
      pageSize: PAGE_SIZE,
      hasMore: false,
      itemCount: 0,
    };
  }

  componentDidMount() {
    this.fetchData(false);
  }

  onChangeDate(date) {
    this.fetchData(false, { month: date, page: 1 });
  }

  onLoadMore() {
    this.fetchData(true, { page: this.state.page + 1 });
  }

  fetchData(append, changeState) {
    const newState = { ...this.state, ...changeState };

    busService
    .getRechargeLog(newState.month, newState.page, newState.pageSize)
    .then(autoErrorPage(this.props.dispatch, ({ data }) => {
      let newList;

      const hasMore = data.length === newState.pageSize;
      if (append) {
        newList = this.state.list;
        newList.push(...data);
      } else {
        newList = data;
      }
      const itemCount = data.length;
      this.setState({ ...changeState, loading: false, list: newList, itemCount, hasMore });
    }));
  }

  render() {
    const createOnClick = (item) => {
      return () => {
        this.props.dispatch({ type: 'ebuscard/showRechargeDetail', payload: { data: item, page: '/rechargeDetail' } });
      };
    };

    const datePickerConfig = {
      // visible: true,
      mode: 'month',
      maxDate: moment(),
      minDate: moment().subtract(1, 'year'),
      onChange: this.onChangeDate.bind(this),
    };

    return (
      <DocumentTitle title="充值记录">
        <div className={styles.win}>
          <Loading loading={this.state.loading}>
            <DatePicker {...datePickerConfig} >
              <div className={styles.monthLabe}>
                <div className={styles.floatLeft} >{this.state.month.format('YYYY年MM月')}</div>
                <div className={styles.floatRight} >
                  <img alt="ICON" src={`${config.cdnHost}/image/calendar70.png`} />
                </div>
                <div className={styles.clearLine} />
              </div>
            </DatePicker>
            <List>
              { this.state.list.map((item) => {
                return (
                  <List.Item arrow="horizontal" extra={`${Utils.formatRMBYuanDecimal(item.rechargeAmmount)} 元`} onClick={createOnClick(item)}>
                    充值 <List.Item.Brief>{item.gmtCreate}</List.Item.Brief>
                  </List.Item>
                );
              }) }

              {
                    this.state.hasMore ? <div className={styles.footer}><p onClick={this.onLoadMore.bind(this)} > 加载更多... </p></div> : ''
                }

              {
                    (this.state.list.length === 0 && this.state.page === 1) ? <div className={styles.nodata}><img src={`${config.cdnHost}/image/img_nothing.png`} alt="" /><p>暂无数据</p></div> : ''
                }
            </List>

          </Loading>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect()(RechargeListPage);
