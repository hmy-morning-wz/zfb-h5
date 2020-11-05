
import update from 'immutability-helper';

import { routerRedux } from 'dva/router';

import Utils from '../utils/Utils';

export default {

  namespace: 'ebuscard',

  state: {
    travelDetail: null,
    rechargeDetail: null,
    mainPage: {
      newOpen: false,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(({ pathname }) => {
        if (pathname === '/guide' || pathname === '/main') {
          Utils.setTransparentTitle(true);
        } else {
          Utils.setTransparentTitle(false);
        }
        if (pathname === '/') {
          if (global.ebusConfig.page !== 'index') {
            dispatch(routerRedux.replace(`/${global.ebusConfig.page}${global.location.search}`));
          } else if (global.ebusConfig.newUser) {
            dispatch(routerRedux.replace('/guide'));
          } else {
            dispatch(routerRedux.replace('/main'));
          }
        }
      });
    },
  },

  effects: {
    *showRechargeDetail({ payload }, { put }) {  // eslint-disable-line
      yield put({ type: 'setRechargeDetail', payload: payload.data });
      yield put(routerRedux.push(payload.page));
    },

    *showTravelDetail({ payload }, { put }) {
      yield put({ type: 'setTravelDetail', payload: payload.data });
      yield put(routerRedux.push(payload.page));
    },

    *showNewOpen({ payload }, { put }) {
      yield put({ type: 'setNewOpen', payload: { newOpen: true } });
      yield put(routerRedux.replace(payload.page));
    },
  },

  reducers: {
    setTravelDetail(state, action) {
      return update(state, { travelDetail: { $set: action.payload } });
    },

    setRechargeDetail(state, action) {
      return update(state, { rechargeDetail: { $set: action.payload } });
    },

    setNewOpen(state, { payload }) {
      return update(state, {
        mainPage: {
          newOpen: { $set: payload.newOpen },
        },
      });
    },
  },
};
