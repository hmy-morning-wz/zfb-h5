
import { apiGet, apiPost } from '../utils/request';

class ECardService {
  init(cityCode, ver) {
    this.config = { cityCode };

    this.options = { ver };
  }

  deviceIs(name) {
    const u = navigator.userAgent;
    if ('Android' === name) {
      return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    }
    if ('iOS' === name) {
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }
    return false;
  }

  parseUA() {
    const ua = navigator.userAgent;
    const regx = new RegExp(/(\([^\(\)]*\))/);
    const group = regx.exec(ua);    
    let info = group[0];    
    info = info.substr(1, info.length - 1);    
    const pi = info.split(';');
    if (this.deviceIs('iOS')) {
      return {
        app: 'alipay',
        model: pi[0],
        platform: pi[1]
      };
    }
    if (this.deviceIs('Android')) {
      return {
        app: 'alipay',
        model: pi[4].split('Build/')[0],
        platform: pi[2]
      }; 
    }
    return {
      app: 'alipay', model: 'unknown', platform: 'unknown'
    };
  }

  async getCityConfig() {    
    return apiGet('ioc.ebuscard.city.config', this.config, this.options);
  }

  async getCard() {
    let ua = {app: 'alipay', model: 'unknown', platform: 'unknown'};
    try {
      ua = this.parseUA();
    } catch (ignored) {}
    return apiGet('ioc.ebuscard.card.my', {...this.config, ...ua}, this.options);
  }

  async getRechargeConfig() {
    return apiGet('ioc.ebuscard.recharge.template', this.config, this.options);
  }

  getRechargeLog(month, page, pageSize) {
    const monthStr = month.format('YYYY-MM');
    const param = {
      ...this.config,
      month: monthStr,
      page,
      pageSize,
    };
    return apiGet('ioc.ebuscard.recharge.records', param, this.options);
  }

  async getTravelLog(month, page, pageSize) {
    const monthStr = month.format('YYYY-MM');
    return apiGet('ioc.ebuscard.travel.records', { ...this.config, month: monthStr, page, pageSize }, this.options);
  }

  async register(param) {
    return apiPost('ioc.ebuscard.card.register', { ...this.config, ...param });
  }

  async getCertUrl() {
    return apiGet('ioc.ebuscard.certification.url', this.config);
  }

  async unregister() {
    return apiPost('ioc.ebuscard.card.unregister', this.config);
  }

  async rollbackUnregister() {
    return apiPost('ioc.ebuscard.card.rollback_unregister', this.config);
  }

  async queryPay(orderId) {
    return apiGet('ioc.ebuscard.recharge.query', { ...this.config, outTradeNo: orderId });
  }

  async recharge(accountType, amount) {
    return apiPost('ioc.ebuscard.card.recharge', { ...this.config, accountType, amount });
  }

  async getAutoRechargeStatus() {
    return apiGet('ioc.ebuscard.auto_recharge.query', this.config);
  }

  async signAndOpenAutoRecharge(type, balance, ammount) {
    return apiPost('ioc.ebuscard.auto_charge.open', { ...this.config, type, balance, ammount });
  }

  async cancelAutoRecharge(type) {
    return apiPost('ioc.ebuscard.auto_recharge.cancel', { ...this.config, type });
  }

  async eventTrack(eventTrackType, cardInfo) {
    return apiPost('ioc.ebuscard.eventrack.log', {...this.config, eventTrackType, ...cardInfo});
  }

  async queryFaq() {
    return apiGet('ioc.ebuscard.city.faq', this.config);
  }

  async queryLines() {
    return apiGet('ioc.ebuscard.city.lines', this.config);
  }
}

export default new ECardService();
