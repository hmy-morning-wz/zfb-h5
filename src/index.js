import dva from 'dva';
import './index.css';

import config from './utils/config';
import busService from './services/busService';

busService.init(global.ebusConfig.city.cityCode, '1.0');
config.cdnHost = global.ebusConfig.cdnHost || '';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/ebuscard'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

// 判断终端是否是 iphoneX
var u = navigator.userAgent;
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
sessionStorage.ipX = 0
if (isIOS) {    
  if (screen.height == 812 && screen.width == 375){
    sessionStorage.ipX = 1
  }
}
console.log(sessionStorage.ipX)
// alert(sessionStorage.ipX)
