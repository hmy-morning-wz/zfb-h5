import React from 'react';

import { connect } from 'dva';
import { Accordion, WingBlank } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';
import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
import { Loading } from '../../components';

import styles from './styles.less';

class FAQPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
      faq: []
    };
  }

  componentDidMount() {    
    const dispatch = this.props.dispatch;
    busService.queryFaq().then(autoErrorPage(dispatch, ({data}) => {      
      this.setState({
        loading: false,
        faq: data.list,
      });
      global.ap && global.ap.hideLoading();
    }));
  }

  render() {
    return (
      <DocumentTitle title="帮助">
        <Loading loading={this.state.loading}>
          <Accordion accordion >
            { this.state.faq.map((item) => {
              return (
                <Accordion.Panel header={item.question} accordion>
    
                  <WingBlank size="md">
                    <div className={styles.answer}>
                      {item.answer}
                    </div>
                  </WingBlank>
                </Accordion.Panel>
              );
            }) }
          </Accordion>
        </Loading>
      </DocumentTitle>
    );
  }
}

export default connect()(FAQPage);
