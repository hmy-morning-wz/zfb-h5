const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

const defaultConfig = {
  title: 'EBusCard',
  footer: 'EBusCard ©2017 Created by X-Man',
  env,
  gateWay: '/gateway.do',
  mock: true,

  payQueryMaxCount: 10,
  payQueryDuration: 3,

  alipayBusQRUrl: 'https://render.alipay.com/p/f/public_transit/card_entry.html',

  cndHost: '',

  quota: 99900,
};

const developmentConfig = {
  host: '',
  mock: true,
};

const productionConfig = {
  host: '',
  mock: false,
};


export default {
  ...defaultConfig, ...(isDevelopment ? developmentConfig : productionConfig),
};
