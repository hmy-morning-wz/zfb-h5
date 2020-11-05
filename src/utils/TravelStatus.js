  // 正常
  const NORMAL = 0;

  // 未支付
  const UNPAY = 1;

  // 异常
  const ERROR = 2;

  const toName = (status) => {
    const names = { };
    names[NORMAL] = '已支付';
    names[UNPAY] = '未支付';
    names[ERROR] = '异常';

    return names[status] || `未知-${status}`;
  };

  export default {
    NORMAL,
    UNPAY,
    ERROR,

    toName,
  };
