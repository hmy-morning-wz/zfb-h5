import React from 'react';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Button, Flex, Icon, Modal, WingBlank, WhiteSpace } from 'antd-mobile';

// import DocumentTitle from 'react-document-title';
import DocumentTitle from '../../components/ApDocumentTitle';

import index, { Loading } from '../../components';

import busService from '../../services/busService';
import { autoErrorPage, makeBusQRUrl } from '../../utils/RequestHelper';
import CardStatus from '../../utils/CardStatus';
import globalConfig from '../../utils/config';

import styles from './styles.less';

const Menu = props => (
  <div style={{textAlign: 'center'}}>
    <div style={{position: 'relative', bottom: '60px'}}>
      <div className={styles.pop}>{ props.badge ? <div className={styles.bubble}>{props.badge}</div> : '' }</div>
    </div>
    <img src={props.icon} style={{ width: '0.6rem', height: '0.6rem' }} />
    <div style={{ color: '#333333', fontSize: '35px', marginTop: '0.15rem', fontFamily: 'PingFangSC-Regular' }}>
      <span>{props.text}</span>
    </div>
  </div>
);

const PlaceHolder = props => (
    <div>
      { props.icon ? <Menu {...props} /> : '' }
    </div>
);

class NineGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rowPadding: '20px'
    };
  }

  componentDidMount() {
    const data = this.props.data;
    const hasBadge = data.some(e => {
      return !!e.badge;
    });
    if (hasBadge) {
      this.setState({
        rowPadding: '70px'
      });
    }
  }

  render() {
    const data = this.props.data,
    col = 3;
    const rows = data.length % col === 0 ? parseInt(data.length / 3) : Math.ceil(data.length / 3);
    const arr = [];
    for (let i = 0; i < rows; i++) {
      arr.push(data.slice(i * 3, i * col + col));
    }
    const last = arr.pop();
    const l = last.length;
    for (let i = 0; i < 3 - l; i++) {
      last.push({
        icon: '', text: i, data: null, badge: null
      });
    }
    arr.push(last);
    return (
      <div style={{padding: '0'}}>
        {
          arr.map((e, index) => {
            return (
              <div key={index} style={{marginBottom: '50px'}}>
                <WhiteSpace size="sm" />
                <Flex justify="center">
                  {
                    e.map((el, i) => {
                      return (
                        <Flex.Item 
                          onClick={() => this.props.onClick({data: el.data}, i)} 
                          key={i} 
                          style={{textAlign:'center', paddingTop: this.state.rowPadding}}>
                          <PlaceHolder icon={el.icon} text={el.text} badge={el.badge} />
                        </Flex.Item>
                      )
                    })
                  }
                </Flex>
              </div>
            );
          })
        }
      </div>
    );
  }
}

const openWindow = url => {
  if (global.ap) {
    global.ap.pushWindow(url);
  } else {
    global.location.href = url;
  }
};

class MainPage extends React.Component {
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
      if (data === null) {
        this.props.dispatch(routerRedux.push('/guide'));
      }
    }, '/'));
  }

  onClickMenu(menu) {
    const info = global.ebusConfig.city;
    const dispatch = this.props.dispatch;

    // TODO
    const lifeUrl = info.openLifeUrl;

    const cardInfo = this.state.data || {};

    const MenuHandler = {
      balance: () => {
        busService.eventTrack('ELECTRONIC_WALLET_MENU_EVENT', cardInfo).then(s => {
          dispatch(routerRedux.push('/balance'));
        });
      },
      recharge: () => {
        busService.eventTrack('RECHARGE_MENU_EVENT', cardInfo).then(s => {
          const cardState = this.state.data;
          const cardId = cardState ? cardState.cardId : '-';
          dispatch(routerRedux.push({
            pathname: '/recharge',
            query: { cardId },
          }));
        });
      },
      rechargeRecord: () => {
        busService.eventTrack('RECHARGE_RECORDS_MENU_EVENT', cardInfo).then(s => {        
          if (menu.url) {
            openWindow(menu.url);
          } else {
            dispatch(routerRedux.push('/rechargeLog'))
          }
        });
      },
      travelRecord: () => {
        busService.eventTrack('TRAVEL_RECORDS_MENU_EVENT', cardInfo).then(s => {
          if (menu.url) {
            openWindow(menu.url);
          } else {
            dispatch(routerRedux.push('/travelLog'));
          }
        });
      },
      openLines: () => {
        busService.eventTrack('LINE_INQUIRY_MENU_EVENT', cardInfo).then(s => {
          if (menu.url) {
            openWindow(menu.url);
          } else {
            dispatch(routerRedux.push('/openLines'));
          }
        });
      },
      faq: () => {
        busService.eventTrack('USAGE_HELP_MENU_EVENT', cardInfo).then(s => {
          if (menu.url) {
            openWindow(menu.url);
          } else {
            dispatch(routerRedux.push('/faq'));
          }
        });
      },
      openLife: () => {
        busService.eventTrack('OPEN_LIFE_MENU_EVENT', cardInfo).then(s => {
          global.location.href = lifeUrl;
        });
      },
      unregister: () => {
        busService.eventTrack('UNREGISTER_CARD_MENU_EVENT', cardInfo).then(s => {
          if (this.isCardActive()) {
            this.doUnregister();
            // global.alert('功能建设中');
          } else {
            dispatch(routerRedux.push('/unregistering'));
          }
        });
      },
      wawa: () => {
        busService.eventTrack('GAME_WAWA_MENU_EVENT', cardInfo).then(s => {        
          if (menu.url) {
            openWindow(menu.url);
          }
        });
      },
      supermanMall: () => {
        busService.eventTrack('WX_SUPERMAN_MALL_MENU_EVENT', cardInfo).then(s => {        
          if (menu.url) {
            openWindow(menu.url);
          }
        });
      },
    };
    const func = MenuHandler[menu.code];

    if (func) {
      func(menu);
    } else if (menu.url) {
      busService.eventTrack(menu.code, cardInfo).then(s => {        
        openWindow(menu.url);
      });
    } else {
      global.alert('功能建设中，敬请期待!');
    }
  }

  doUnregister() {
    const dispatch = this.props.dispatch;
    const alertInstance = Modal.alert('退卡', '确定退卡？', [
      {
        text: '确定',
        onPress: () => {
          // busService.unregister().then(autoErrorPage(dispatch, () => {
          //   dispatch(routerRedux.push('/unregistering'));
          // }));

          busService.unregister().then(autoErrorPage(dispatch, ({ data }) => {
            dispatch(routerRedux.push('/unregistering'));
            const confirmAlert = Modal.alert('退卡成功', data, [
              {
                text: '确定',
                onPress: () => {
                  confirmAlert.close();
                  dispatch(routerRedux.push('/unregistering'));
                },
                style: { fontWeight: 'bold' },
              },
            ]);
          }));
        },
      },
      {
        text: '取消',
        onPres: () => alertInstance.close(),
        style: { fontWeight: 'bold' },
      },
    ]);
  }

  welcomeModal(show) {
    const info = global.ebusConfig.city;
    const cardState = this.state.data || {};
    let defaultModalImg = 'welcome.png';    

    const { welcomeTitle, showRechargeBtn } = info;
    const ecType = cardState.ecType;
    const config = {
      visible: show,
      // transparent,
      title: welcomeTitle,
      className: styles.welcomeTitle,
      footer: [
        {
          text: '查看卡片',
          onPress: () => {
            this.props.dispatch({
              type: 'ebuscard/setNewOpen',
              payload: { newOpen: false },
            });
          },
        },
      ],
    };
    if (info.cityCode === '442000') {
      defaultModalImg = '442000/v1/success-tip.png';
      config.footer.length = 0;
      config.footer.push({
        text: '返回首页',
        onPress: () => {
          global.open('alipays://platformapi/startapp?appId=2018090361288261&page=/pages/launch/launch');
        },
      }, {
        text: '立即使用',
        onPress: () => {
          const url = makeBusQRUrl(info.cityCode, cardState.cardId,
            info.alipayCardType, info.alipaySource);
          global.open(url);
        },
      });
    } else {
      if ((ecType === 1 || ecType === 2) && showRechargeBtn !== 'FALSE' ) {
        const cardId = this.state.data ? this.state.data.cardId : '-';
        config.platform = 'ios';
        config.footer.push({
          text: '立即充值',
          onPress: () => {
            this.props.dispatch({
              type: 'ebuscard/setNewOpen',
              payload: { newOpen: false },
            });
            this.props.dispatch(routerRedux.push({
              pathname: '/recharge',
              query: { cardId },
            }));
          }
        });
      } else {
        config.footer.push({
          text: "立即乘车",
          onPress: () => {
            this.props.dispatch({
              type: 'ebuscard/setNewOpen',
              payload: { newOpen: false },
            });
            const url = makeBusQRUrl(info.cityCode, cardState.cardId, info.alipayCardType, info.alipaySource);
            global.open(url);
          }
        });
      }
    }

    return (
      <Modal transparent {...config} style={{ width: '90%', 'borderRadius': '20px' }}>

        <WhiteSpace size="md" />
        <div className={styles.whelcomeModal}>
          <img alt="ICON1" src={`${globalConfig.cdnHost}/image/${defaultModalImg}`} />
          <WhiteSpace size="md" />
          {
            info.cityCode === '442000' ? 
            <p>您可以通过&nbsp;<span>点击右上角-添加到桌面</span>&nbsp;快捷打开</p> : 
            <p>您可以通过&nbsp;<span>首页-付款-乘车码</span>&nbsp;立即使用</p>
          }
          
        </div>

      </Modal>
    );
  }

  isCardActive() {
    const cardState = this.state.data;
    return cardState && cardState.status === CardStatus.ACTIVE;
  }

  render() {
    const info = global.ebusConfig.city;

    const cardState = this.state.data || {};

    var ua = navigator.userAgent;
    const isAliWebview = (ua.indexOf("AliApp") != -1) || (ua.indexOf("Nebula") != -1);
    let logoUrl = '';
    if (info.cityCode === '321000') {
      if(isAliWebview){
        logoUrl = info.logoUrl;
      }else {
        logoUrl = 'https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/alipay/yz/yz.png';
      }
    }else{
      logoUrl = info.logoUrl;
    }

    const buildMenu = (menu, idx) => {
      const menus = [];
      info.menus.map((menu, idx) => {
        if(info.cityCode === '321000'){
          if(isAliWebview){
            menus.push({
              icon: menu.icon,
              text: menu.name,
              data: menu,
              badge: menu.badge,
            });
          }else {
            if (menu.name != '生活号' && menu.name != '电子钱包') {
              menus.push({
                icon: menu.icon,
                text: menu.name,
                data: menu,
                badge: menu.badge,
              });
            }
          }
        }else{
          menus.push({
            icon: menu.icon,
            text: menu.name,
            data: menu,
            badge: menu.badge,
          });
        }
      });

      return menus;
    };

    const cardDisabled = cardState.disabled > 0;

    const onUseClick = () => {
      if (cardDisabled) {
        const tips = cardState.disabledTips || '卡片已禁用!';

        Modal.alert('提示', tips, [
          {
            text: '确定',
          },
        ]);
      } else {
        const url = makeBusQRUrl(info.cityCode, cardState.cardId,
          info.alipayCardType, info.alipaySource);
        global.open(url);
      }
    };

    const onAdClick = (adId, adLink) => {
      busService.eventTrack('AD_LINK_MENU_EVENT', {...cardState, adId}).then(s => {
        if (global.ap) {
          global.ap.pushWindow(adLink);
        } else {
          global.location.href = adLink;
        }
      });
    };

    const menuClick = (el, index) => {
      this.onClickMenu(el.data);
    }
    const marginTop = +sessionStorage.ipX === 1 ? '1.4rem' : '1.2rem'

    return (
      <DocumentTitle title={info.cardName}>
        <Loading loading={this.state.loading}>
          <div style={{background: '#fff', height: '100%'}}>
          {this.welcomeModal(this.props.newOpen)}
          {
            <div className={styles.cardBg} />
          }
          <div className={styles.marginSpace}></div>
          <div className={styles.card} style={{ marginTop: marginTop, backgroundImage: `url(${logoUrl})` }}>
            <div className={styles.cardNo}>NO.{cardState && cardState.cardId}</div>
          </div>
          <div className={styles.listView} id="listView">
            <NineGrid data={buildMenu()} onClick={menuClick}/>
          </div>
          <div title="adBanner">
            {
              info.adBanner && info.adBanner.map((ad, index) => {
                return (
                  <a className={styles.adLink} onClick={() => onAdClick(ad.id, ad.adImgLink)} key={index}>
                    <img src={ad.adImgSrc} style={{ width: '100%', height: '1.5rem' }} alt="icon" />
                  </a>
                );
              })
            }
          </div>
          <div title="BTN" className={styles.footer}>
            <WingBlank size="lg">
              <Button disabled={!this.isCardActive()} type="primary" onClick={onUseClick}>
                立即使用
              </Button>
            </WingBlank>
          </div>
          </div>
        </Loading>
      </DocumentTitle>
    );
  }

}

const mapStateToProps = (state) => {
  return state.ebuscard.mainPage;
};

export default connect(mapStateToProps)(MainPage);
