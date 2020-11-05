
import React from 'react';

import { connect } from 'dva';


import { DatePicker, List, ListView } from 'antd-mobile';
import moment from 'moment';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import Utils from '../../utils/Utils';
import config from '../../utils/config';
import { Loading } from '../../components';
import styles from './styles.less';


/** 每页数据行数 */
const PAGE_SIZE = 10;
/** 当前页加载页码. */
let pageIndex = 0;

/*
 * 自定义下拉刷新组件
 */
function ListViewBody(props) {
  return (
    <div className="am-list-body my-body">
      {props.children}
    </div>
  );
}


class TravelLogPage extends React.Component {

  /*
   * 构造方法.
   */
  constructor(props) {
    super(props);
    this.initListView(moment(), true);
  }

  componentDidMount() {
    this.loadOnPageFromAjax(0, this.state.month);
  }


  /**
   * 页面滚动到底的时候出发.
   */
  onEndReached = () => {
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    this.loadOnPageFromAjax(pageIndex += 1, this.state.month);
  }

  onChangeDate(date) {
    this.initListView(date, false);
    this.loadOnPageFromAjax(0, date);
  }

  initListView(date, create) {
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.dataBlob = {};
    this.sectionIDs = [];
    this.rowIDs = [];
    pageIndex = 0;
    if (create) {
      this.state = {
        dataSource:
        dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        isLoading: true,
        loading: true,
        hasMore: true,
        month: date,
        itemNum: 0,
      };
    } else {
      this.setState({
        dataSource:
        dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        isLoading: true,
        loading: true,
        hasMore: true,
        month: date,
        itemNum: 0,
      });
    }
  }

  /**
   * 从服务器后台加载指定月份特定页码的数据
   * @params pageId 待加载的页码，从0开始编码
   */
  loadOnPageFromAjax(pageId, month) {
    // global.console.log(`开始从Ajax加载一页数据.pageId:${pageId}`);
    busService
    .getTravelLog(month, pageId + 1, PAGE_SIZE)
    .then(autoErrorPage(this.props.dispatch, ({ data }) => {
      // global.console.log(data);
      // 根据构建dataBlob
      const sectionName = `Section ${pageId}`;
      this.sectionIDs.push(sectionName);
      this.dataBlob[sectionName] = sectionName;
      this.rowIDs[pageId] = [];
      for (let jj = 0; jj < data.length; jj += 1) {
        const rowName = `S${pageId}, R${jj}`;
        this.rowIDs[pageId].push(rowName);
        this.dataBlob[rowName] = data[jj];
      }
      // new object ref
      this.sectionIDs = [].concat(this.sectionIDs);
      this.rowIDs = [].concat(this.rowIDs);
      // global.console.log(`------>${this.state.itemNum + data.length}`);
      this.setState({
        dataSource:
        this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        isLoading: false,
        loading: false,
        hasMore: (data.length >= PAGE_SIZE),
        itemNum: (this.state.itemNum + data.length),
      });
      // global.console.log(`完成从Ajax加载一页数据.pIndex:${pageId}`);
    }));
  }

  render() {
    /**
     * 打开详情页面.
     */
    const createOnClick = (item) => {
      return () => {
        this.props.dispatch({ type: 'ebuscard/showTravelDetail', payload: { data: item, page: '/travelDetail' } });
      };
    };

    /**
     * 渲染一行数据.
     */

    const renderRow = (rowData) => {
      // global.console.log(`开始渲染一行数据${rowData}`);
      return (
        <div id="listView_1">
          <List>
            <List.Item arrow="horizontal" extra={`-${Utils.formatRMBYuanDecimal(rowData.deductedAmt)}元`} onClick={createOnClick(rowData)}>
              {rowData.lineName } <List.Item.Brief>{rowData.gmtBizTime}</List.Item.Brief>
            </List.Item>
          </List>
        </div>
      );
    };

    /**
     *渲染页脚
     */
    const renderFooter = () => {
      if (this.state.isLoading) {
        return (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <embed src={`${config.cdnHost}/svg/loading.svg`} width="100" height="100" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />
          </div>
        );
      }
    };

    const datePickerConfig = {
      // visible: true,
      value: this.state.month,
      mode: 'month',
      maxDate: moment(),
      minDate: moment().subtract(1, 'year'),
      onChange: this.onChangeDate.bind(this),
    };


    return (
      <DocumentTitle title="乘车记录">
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
            <ListView
              dataSource={this.state.dataSource}
              renderFooter={renderFooter}
              renderBodyComponent={() => <ListViewBody />}
              renderRow={renderRow}
              style={{
                height: global.document.documentElement.clientHeight,
              }}
              pageSize={10}
              scrollRenderAheadDistance={1}
              scrollEventThrottle={1}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            >
              {
              (this.state.itemNum === 0 && !this.state.isLoading) ? <div className={styles.nodata}><img src={`${config.cdnHost}/image/img_nothing.png`} alt="" /><p>暂无数据</p></div> : ''
            }
            </ListView>
          </Loading>
        </div>
      </DocumentTitle>);
  }
}

export default connect()(TravelLogPage);
