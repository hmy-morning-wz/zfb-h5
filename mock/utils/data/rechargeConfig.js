// import './src/utils/AccountType';
const AccountType = {
  RECHARGE: 1,
  MONTH: 2,
  SEASON: 3,
  YEAR: 4,
  ALIPAY_CREDIT: 10,
};

const recharge330000 = {};
recharge330000[AccountType.ALIPAY_CREDIT] = {
  type: AccountType.ALIPAY_CREDIT,
  name: '现象后付',
  tips: '无须充值',
  list: [
  ],
};

recharge330000[AccountType.RECHARGE] = {
  type: AccountType.RECHARGE,
  "rechargeable": true,
  name: '标准卡',
  tips: '充值不清零',
  list: [
    {
      id: 1,
      price: 5,
      tips: '充值次5元',
      value: 1,
      flags: ['hot'],
    },
    {
      id: 2,
      price: 10,
      tips: '充值次10元',
      value: 500,
      flags: [],
    },
    {
      id: 2,
      price: 20,
      tips: '充值次20',
      value: 1000,
      flags: [],
    },
    {
      id: 4,
      price: 400,
      tips: '200块钱，充值次数为45',
      value: 2000,
      flags: [],
    }
  ],
};

recharge330000[AccountType.MONTH] = {
  type: AccountType.MONTH,
  name: '月卡',
  tips: '充值余额月底清理',
  "rechargeable": true,
  list: [
    {
      id: 1,
      price: 5,
      tips: '5块钱，充值次数为10次',
      value: 10,
      flags: [],
    },
    {
      id: 2,
      price: 10,
      tips: '10块钱，充值次数为20次',
      value: 20,
      flags: [],
    },
    {
      id: 3,
      price: 20,
      tips: '20块钱，充值次数为45',
      value: 40,
      flags: ['hot'],
    },
  ],
};

module.exports = {
  '330000': recharge330000,
};
