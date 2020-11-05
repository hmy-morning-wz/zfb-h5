
const DECIMAL_PRECISE = 1e-7;

const formatRMBYuan = (fen) => {
  const yuan = fen / 100;
  const decimal = Math.abs(yuan - Math.floor(yuan));
  const equal = decimal < DECIMAL_PRECISE;

  if (equal) {
    return yuan;
  } else {
    return yuan.toFixed(2);
  }
};

const formatRMBYuanDecimal = (fen) => {
  return (fen / 100).toFixed(2);
};

const setTransparentTitle = (transparent) => {
  if (global.AlipayJSBridge) {
    const transparentTitle = transparent ? 'always' : 'none';
    global.AlipayJSBridge.call('setTransparentTitle', { transparentTitle }, () => {});
  }
};

const arrayFind = (arr, predicate) => {
  if (!arr) {
    return null;
  }

  for (let i = 0; i < arr.length; i += 1) {
    if (predicate(arr[i], i)) {
      return arr[i];
    }
  }
};

const getAccountByType = (tp) => {
  return arrayFind(global.ebusConfig.city.supportAccount, item => item.type === tp);
};

export default {
  formatRMBYuan,
  formatRMBYuanDecimal,
  setTransparentTitle,

  arrayFind,

  getAccountByType,
};
