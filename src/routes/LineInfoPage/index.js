import React from 'react';
import { connect } from 'dva';
import { List, SearchBar } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';
import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import { Loading } from '../../components';

import styles from './styles.less';

const ListItem = List.Item;
const ListBrief = ListItem.Brief;

class LineInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      keyword: null,
      lines: [],
    };
  }
  componentDidMount() {
    const dispatch = this.props.dispatch;
    busService.queryLines().then(autoErrorPage(dispatch, ({data}) => {
      this.setState({
        loading: false,
        lines: data.list,
      });
      global.ap && global.ap.hideLoading();
      this.node.scrollIntoView();
    }));   
  }

  render() {
    const cityLines = this.state.lines;

    const keyword = this.state.keyword ? this.state.keyword.trim() : null;

    const lines = cityLines.filter((line) => {
      const test = (word) => {
        return word.toString().indexOf(keyword) >= 0;
      };

      return keyword === null || test(line.no) || test(line.from) || test(line.to);
    });

    const onChange = (value) => {
      this.setState({ keyword: value });
    };

    return (
      <DocumentTitle title="开通线路" >
        <Loading loading={this.state.loading}>
          <div>
            <div className={styles.fixTop}>
              <SearchBar placeholder="请输入线路号" onChange={onChange} />
            </div>
            <div className={styles.topMargin} ref={(node) => { this.node = node; return this.node; }}>
              <List>
                {lines.map((line) => {
                  return (
                    <ListItem key={line.no} >
                      {line.no}
                      <ListBrief>{line.from} - {line.to}</ListBrief>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </Loading>
      </DocumentTitle>
    );
  }
}

export default connect()(LineInfoPage);
