// 正常，已激活
const ACTIVE = 1;

// 退卡中
const UNREGISTING = 2;

// 已退卡
const UNREGISTED = 3;

// 未激活
const UNACTIVE = 0;

// 已冻结
const FROZEN = 4;

// 发起退款，退卡未完成
const REFUNDING = 5;

// 退卡失败
const REVOKE_FAILED = 6;

export default {
  ACTIVE,
  UNREGISTING,
  UNREGISTED,
  UNACTIVE,
  FROZEN,
  REFUNDING,
  REVOKE_FAILED
};
