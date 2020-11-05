
module.exports = {
  '330000': {
    "city": "杭州",
    "cityCode": "321000",
    "cardName": "厦门市电子公交卡",
    "logoUrl": "/image/532301/v1/card-logo.jpg",
    "bgPic": "http://cdnweb04.96225.com/images/bg_card.png",
    "iconUrl":"http://cdn7.staztic.com/app/i/5671/5671546/commegaeyesbusplatform-1-l-124x124.png",
    "cardMemo":"支持电子钱包",
    "guideBg":"/image/bg.jpg",
    "openCardUrl": "",
    "cardUrl": "",
    "openLifeUrl": "http://www.taobao.com",
    "cardAgreementUrl": "/protocol/321000/v1/protocol.htm",
    "antAgreementUrl": "/protocol/321000/v1/protocol-ant.htm",
    "loopQueryPayResult":"",
    "showRechargeBtn": "FALSE",
    "copyRight": "本服务由支付宝、通卡联城联合提供",
    "agreements": [{
      "protocolName": "《市民卡协议》",
      "protocolUrl": "/protocol/320200/v1/protocol.htm"
    },
    {
      "protocolName": "《蚂蚁金服金服金服金服协议》",
      "protocolUrl": "/protocol/320200/v1/protocol-ant.htm"
    }],
    "welcomeTitle": "恭喜您！ 领卡成功",
    "functions": [      
      {
        "name": "先乘车 后付款",
        "memo": "刷码上车，车费从支付宝账户扣款"
      }
    ],
    "supportAccount": [
      {
        "name": "先享后付",
        "type": 10,
        "memo": "支持先享后付"
      },
      {
        "name": "充值卡",
        "type": 1,
        "memo": "充值卡, 这个说明很长很长很长很长很长很长很长很长很长很长很长很长",
      },
      {
        "name": "月卡",
        "type": 2,
        "memo": "月卡， 这个说明很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
      }
    ],
    "notice": {
        "id": 1,
        "title": "杭州新增50条线路支持",
        "content": "7月1日，新增290路、302路。。。",
        "gmtStartShow": "2017-06-27 00:00:00",
        "gmtEndShow": "2017-07-27 00:00:00"
      },
    "menus": [
      {
        "code": "balance",
        "name": "余额查询",
        "flag": "",
        "icon": "http://localhost:8000/image/icon/wallet@3x.png",
        // "badge": "85折6666666666",
      },
      // {
      //   "code": "recharge",
      //   "name": "卡片充值",
      //   "flag": ""
      // },
      // {
      //   "code": "rechargeRecord",
      //   "name": "充值记录",
      //   "flag": ""
      // },
      {
        "code": "travelRecord",
        "name": "乘车记录",
        "flag": "",
        "icon": "http://localhost:8000/image/icon/wallet@3x.png",
        "url": "http://www.baidu.com",
      },
      {
        "code": "openLines",
        "name": "开通线路",
        "flag": "",
        "icon": "http://localhost:8000/image/icon/wallet@3x.png"
      },
      {
        "code": "faq",
        "name": "使用帮助",
        "flag": "",
        "icon": "http://localhost:8000/image/icon/wallet@3x.png"
      },
      {
        "code": "unregister",
        "name": "退卡申请",
        "flag": "",
        "icon": "http://localhost:8000/image/icon/wallet@3x.png"
      },
      {
        "code": "openLife",
        "name": "生活号",
        "flag": "",
        "icon": "http://localhost:8000/image/icon/wallet@3x.png"
      },
    ],

    "adBanner": [
      {
        "id": 1,
        "adImgSrc":"http://localhost:8000/image/320200/ad/20180604180716.jpg",
        "adImgLink":"http://www.hgfdrf.com/html/BkyWfYze7",
        "adStartTime":"20180606100000",
        "adEndTime":"20180609100000"
      }
    ],

    "autoCharge": [
      {
        "type": 1,
        "memo": "每月第一天1:00",
        "thresholdAmount": 1000,
        "chargeAmount": 5000
      },
      {
        "type": 2,
        "memo": "当低于10元时自动扣款50元",
        "thresholdAmount": 1000,
        "chargeAmount": 5000
      }
    ],
  }
};
