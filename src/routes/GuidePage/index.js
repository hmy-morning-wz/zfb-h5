import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import { ActionSheet, Button, Checkbox, WingBlank, WhiteSpace, Modal, Flex } from 'antd-mobile';
// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';
import globalConfig from '../../utils/config';

import busService from '../../services/busService';
import { autoErrorPage } from '../../utils/RequestHelper';
// import Utils from '../../utils/Utils';

import { Loading } from '../../components';

import styles from './styles.less';

const AgreeItem = Checkbox.AgreeItem;

class GuidePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      url: null,
      protocolUrl: null,
      agreementVisiable: false,
      agreeProtocol: false,
      showTip: false,
    };
  }

  componentDidMount() {
    busService.getCertUrl().then(autoErrorPage(this.props.dispatch, ({ data }) => {
      this.setState({ loading: false, url: data.url });
    }, '/guide'));
    // this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.timerID && clearTimeout(this.timerID);
  }

  render() {
    const onConfirmOpen = () => {
      this.timerID && clearTimeout(this.timerID);
      if (!this.state.agreeProtocol) {
        this.setState({
          showTip: true
        });
        this.timerID = setTimeout(() => {
          this.setState({
            showTip: false
          });
          delete this.timerID;
        }, 3000);
        return;
      }
      global.location.href = this.state.url;
      // this.props.dispatch({ type: 'ebuscard/showNewOpen', payload: { page: '/main' } });
    };

    const agreeClick = (e) => {
      this.setState({
        agreeProtocol: e.target.checked,
        showTip: false,
      });
    }

    const onAgreement = () => {
      // Utils.setTransparentTitle(false);
      // global.open(info.cardAgreementUrl);
      const BUTTONS = [];
      info.agreements.map((item, idx) => {
        BUTTONS.push(item.protocolName);
      });
      BUTTONS.push('取消');
      ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        maskClosable: true
      },
      (buttonIndex) => {
        if (buttonIndex < BUTTONS.length - 1) {
          if (global.ap) {
            global.ap.pushWindow(info.agreements[buttonIndex].protocolUrl);
          } else {
            global.location.href = info.agreements[buttonIndex].protocolUrl;
          }
        }
      });
    };
    const readProtocol = (url) => {      
      if (global.ap) {
        global.ap.pushWindow(url);
      } else {
        global.location.href = url;
      }
    }
    const unitTip = () => {
      const cityCode = global.ebusConfig.city.cityCode;
      if (cityCode === '321000') {
        return (
          <div className={styles.unit}>
              <span>试点期间仅支持卡片余额付款</span>
          </div>
          );
      }
      return (<WhiteSpace size="lg" />);
    }
    // global.ebusConfig.city.cityCode
    const info = global.ebusConfig.city;

    const bottom = +sessionStorage.ipX === 1 ? '0.2rem' : '0.1rem'
    return (
      <DocumentTitle title={info.cardName}>
        <Loading loading={this.state.loading} className={styles.win}>
          <div className={styles.win} >
            <div name="背景" className={styles.cardBg} style={{ backgroundImage: `url(${info.guideBg})` }} >

            <div name="卡片" className={styles.card}  >
              <img style={{width: '100%',boxShadow: "0px 10px 20px -5px rgba(0,0,0,0.2)", borderRadius:'20px'}} src={`${info.logoUrl}`} />
            </div>

            </div>
            
            <div name="协议" className={styles.protocols}>
              <Flex justify="start">
                <Flex.Item>
                  <QueueAnim animConfig={[{ opacity:[1, 0] }, { opacity:[1, 0] }]} duration={2000} style={{height: '0.8rem', marginBottom: '0.1rem'}}>
                    {
                    this.state.showTip ? <div key='tip' style={{
                      backgroundImage: `url(${globalConfig.cdnHost}/image/tip.png)`,
                      }} className={styles.tip}>
                    </div> : null}
                  </QueueAnim>	
                  <AgreeItem onChange={agreeClick} style={{marginTop: '-25px', display: 'inline-block', marginLeft: 0}} checked={this.state.agreeProtocol}>  
                    我已阅读并同意                            
                  </AgreeItem>
                  <span>
                  {
                    info.agreements.map((item, idx) => {
                      return (<span key={idx} style={{color: '#108ee9'}} onClick={() => readProtocol(item.protocolUrl)}>{item.protocolName}</span>);
                    })
                  }
                  </span>
                </Flex.Item>                
              </Flex>                                         
            </div>
            <WhiteSpace size="lg" />
            <WingBlank size="lg">                            
              <div name="按钮" className={styles.buttonDiv} >
                <Button className={styles.button} type="primary" onClick={onConfirmOpen}>立即领卡</Button>
              </div>
              <WhiteSpace size="lg" />
              <div name="备注" className={styles.memo}>{info.cardMemo}</div>
              <WhiteSpace size="lg" />
              <div name="业务描述" className={styles.accts}>
                {info.functions.map((f) => {
                  return (
                    <div key={f.name}>
                      <em /> <span>{f.name} </span><em />
                      <p>{f.memo} </p>
                      <WhiteSpace size="lg" />
                      <WhiteSpace size="md" />
                    </div>
                  );
                })}
              </div>

              <WhiteSpace size="lg" />
              <div name="页脚" className={styles.footer} style={{ bottom: `${bottom}` }}>{info.copyRight}</div>
            </WingBlank>
          </div>

          <Modal
            style={{ width: '90%' }}
            transparent
            maskClosable={false}
            visible={this.state.agreementVisiable}
          >
            <div className={styles.agreementDiv}>
              <iframe className={styles.agreementFrame} src={this.state.protocolUrl} width="100%" />
            </div>
            <WhiteSpace size="lg" />
            <Button
              type="primary"
              onClick={() => this.setState({ agreementVisiable: false })}
            >
              确定
            </Button>
          </Modal>
        </Loading>
      </DocumentTitle>
    );
  }
}

export default connect()(GuidePage);
// footer={[{ text: '确定', onPress: () => this.setState({ agreementVisiable: false }) }]}
