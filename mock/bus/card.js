import { responseSuccess } from '../utils/ResponseHelper';
import rechargeConfig from '../utils/data/rechargeConfig';
import cityConfig from '../utils/data/cityConfig';

const userBalance = {
  cardId: '999999999999',
  ecType: 1,
  status: 1,
  accounts: [
    {
      id: '33333',
      type: 10,
      name: '先享后付',
    },
    {
      id: '933333333',
      name: '标准卡',
      type: 1,
      balance: 1,
      autoRechargeStatus: true,
    },
    {
      id: 'm0001',
      name: '月卡',
      type: 2,
      balance: 300,
      param: '2017-06',
      autoRechargeStatus: true,
    },
    {
      id: 'm0002',
      name: '月卡',
      type: 2,
      balance: 5000,
      param: '2017-07',
      autoRechargeStatus: false
    },
  ]
};

const rechargeList = [
  {
    status: 0,
    orderId: '3333333',
    gmtCreate: '2017-06-01 12:05:03',
    money: 5,
    cardId: '6666',
    cardType: 'normal',
    param: '',
    rechargeAmmount: 5,
    payUrl: 'http://www.baidu.com/',
    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 0,
    orderId: '3333333',
    gmtCreate: '2017-06-01 12:05:03',
    money: 5,
    cardId: '6666',
    cardType: 'normal',
    param: '',
    rechargeAmmount: 10000,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 1,
    orderId: '3333333',
    gmtCreate: '2017-06-01 12:05:03',
    money: 5,
    cardId: '6666',
    cardType: 'normal',
    param: '',
    rechargeAmmount: 5,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 2,
    orderId: '3333333',
    gmtCreate: '2017-06-01 12:05:03',
    money: 5,
    cardId: '6666',
    cardType: 'normal',
    param: '',
    rechargeAmmount: 5,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 3,
    orderId: '3333334',
    gmtCreate: '2017-06-01 16:05:03',
    money: 10,
    cardId: '6666',
    cardType: 'month',
    param: '2017-06',
    rechargeAmmount: 10,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 'done',
    orderId: '3333334',
    gmtCreate: '2017-06-01 16:05:03',
    money: 10,
    cardId: '6666',
    cardType: 'month',
    param: '2017-06',
    rechargeAmmount: 10,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 'done',
    orderId: '3333334',
    gmtTime: '2017-06-01 16:05:03',
    money: 10,
    cardId: '6666',
    cardType: 'month',
    param: '2017-06',
    rechargeAmmount: 10,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 'done',
    orderId: '3333334',
    gmtTime: '2017-06-01 16:05:03',
    money: 10,
    cardId: '6666',
    cardType: 'month',
    param: '2017-06',
    rechargeAmmount: 10,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 'done',
    orderId: '3333334',
    gmtTime: '2017-06-01 16:05:03',
    money: 10,
    cardId: '6666',
    cardType: 'month',
    param: '2017-06',
    rechargeAmmount: 10,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
  {
    status: 'done',
    orderId: '3333334',
    gmtTime: '2017-06-01 16:05:03',
    money: 10,
    cardId: '6666',
    cardType: 'month',
    param: '2017-06',
    rechargeAmmount: 10,

    payMethod: 'alipay',
    payId: '201706011205xxxxxxx',
  },
];

module.exports = {
  'GET /api/test': { status: 'TEST'},

  'GET /api/bus': (req, res) => {

  },

  'GET /api/config/330000/city': (req, res) => {
    setTimeout( () => { responseSuccess(res, cityConfig['330000']); }, 300);
  },

  'GET /api/ioc/ebuscard/card/my': (req, res) => {
    setTimeout( () => { responseSuccess(res, userBalance); }, 1000);
  },

  'GET /api/ioc/ebuscard/recharge/template': (req, res) => {
    setTimeout( () => {
      const city = '330000';
      const configs = rechargeConfig[city];

      const result = {
        id: userBalance.id,
        upperLimitAmount: 0,
        list: []
      };

      for (let i in userBalance.accounts) {
        const subAccount = userBalance.accounts[i];

        if (configs[subAccount.type]) {
          result.list.push({
            id: subAccount.id,
            param: subAccount.param,
            // type: subAccount.type,
            ...configs[subAccount.type],
          });
        }

      }

      responseSuccess(res, result);
    }, 1000);
  },

  'GET /api/ioc/ebuscard/recharge/records': (req, res) => {
    setTimeout( () => {
      responseSuccess(res, rechargeList);
    }, 1000);
  },

  'GET /api/ioc/ebuscard/recharge/detail': (req, res) => {
    setTimeout( () => {
      responseSuccess(res, rechargeList[0]);
    }, 1000);
  },

  'GET /api/ioc/ebuscard/travel/records': (req, res) => {
    setTimeout( () => {
      responseSuccess(res, {
        noMore: false,
        list: [
          {
            id: '200000000',
            line: '503',
            stopFrom: '天安门',
            stopTo: '天坛',
            gmtStart: '2017-06-05 12:00:01',
            gmtEnd: '2017-06-05 12:30:01',

            payCardType: 'nomal',
            cardId: '3333333',
            payMoney: 2,
          },
          {
            id: '200000001',
            line: '10',
            stopFrom: '天安门',
            stopTo: '天坛',
            gmtStart: '2017-06-05 12:00:01',
            gmtEnd: '2017-06-05 12:30:01',

            payCardType: 'nomal',
            cardId: '3333333',
            payMoney: 2,
          },
          {
            id: '200000002',
            line: '2',
            stopFrom: '天安门',
            stopTo: '天坛',
            gmtStart: '2017-06-05 12:00:01',
            gmtEnd: '2017-06-05 12:30:01',

            payCardType: 'nomal',
            cardId: '3333333',
            payMoney: 2,
          },
          {
            id: '2000000003',
            line: '53',
            stopFrom: '天安门',
            stopTo: '天坛',
            gmtStart: '2017-06-05 12:00:01',
            gmtEnd: '2017-06-05 12:30:01',

            payCardType: 'nomal',
            cardId: '3333333',
            payMoney: 2,
          },
        ]
      });
    }, 1000);
  },

  'GET /api/ioc/ebuscard/auto_recharge/query': (req, res) => {
    setTimeout( () => {
      responseSuccess(res, {
        signed: true,
        list: [
          {
            type: 1,
            memo: "每月第一天1:00",
            chargeAmount: 50,
            "thresholdAmount": 10,
            active: true
          },
          {
            "type": 2,
            "memo": "例如：当低于10元时自动扣款50元",
            "thresholdAmount": 10,
            "chargeAmount": 50,
            "active": false
          }
        ]
      });
    });
  },

  'GET /api/ioc/ebuscard/auto_recharge/open': (req, res) => {
    // setTimeout( () => {
    //
    // });
  },

  'POST /api/ioc/ebuscard/eventrack/log': (req, res) => {
    responseSuccess(res, 'ok');
  },
}
