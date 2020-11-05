
import { routerRedux } from 'dva/router';
import { STATUS_OK, STATUS_REDIRECT, SERVICE_STOPPED, getQueryString } from './request';
import config from './config';

const autoErrorPage = (dispatch, dataHandler, backPage) => {
  return (resp) => {
    const { code, msg, redirectUrl } = resp;

    switch (code) {
      case STATUS_REDIRECT:
        global.location.href = redirectUrl;
        break;
      case SERVICE_STOPPED:
        dispatch(routerRedux.replace({
          pathname: '/unavailable',          
        }));
        break;  
      case STATUS_OK:
        dataHandler(resp);
        break;
      default:
        dispatch(routerRedux.replace({
          pathname: '/error',
          query: { message: msg, code, back: backPage },
        }));
    }
  };
};

const basicResponseHandler = (dataHandler) => {
  return (resp) => {
    switch (resp.code) {
      case STATUS_REDIRECT:
        global.location.href = resp.redirectUrl;
        break;
      default:
        dataHandler(resp);
    }
  };
};

const makeBusQRUrl = (cityCode, cardNo, cardType, source) => {
  const param = {
    action: 'use',
    scene: 'TRANSIT',
    subScene: cityCode,
    source,
    cardType,
  };

  return `${config.alipayBusQRUrl}?${getQueryString(param)}`;
};

export default {
  autoErrorPage,
  basicResponseHandler,
  makeBusQRUrl,
};
