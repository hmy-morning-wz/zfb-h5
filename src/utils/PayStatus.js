
// 支付中
const UNPAY = 0;

// 成功
const SUCCESS = 1;

// 失败
const ERROR = 2;

// 退款
const REFUND = 3;


// 无效的交易号
const INVALID_TRADE_NO = 100;


const toName = (status) => {
  const names = {};

  names[UNPAY] = '未支付';
  names[SUCCESS] = '已付款';
  names[ERROR] = '异常';
  names[REFUND] = '已退款';

  return names[status] || `未知-${status}`;
};

export default {
  UNPAY,
  SUCCESS,
  ERROR,
  REFUND,
  INVALID_TRADE_NO,

  toName,
};
