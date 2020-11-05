import React from 'react';
import { Router, Route } from 'dva/router';

import { GuidePage, LineInfoPage, FAQPage,
  RechargePage, RechargeLogPage, RechargeDetailPage,
  BalancePage, TravelLogPage, TravelDetailPage,
  CertCallbackPage, MainPage, ErrorPage, UnregisteringPage,
  PayResultPage, AutoRechargeEditPage, AutoRechargePage, ServiceUnavailablePage } from './routes';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/">
        <Route path="guide" component={GuidePage} />
        <Route path="main" component={MainPage} />
        <Route path="openLines" component={LineInfoPage} />
        <Route path="faq" component={FAQPage} />
        <Route path="recharge" component={RechargePage} />
        <Route path="rechargeLog" component={RechargeLogPage} />
        <Route path="rechargeDetail" component={RechargeDetailPage} />

        <Route path="balance" component={BalancePage} />
        <Route path="travelLog" component={TravelLogPage} />
        <Route path="travelDetail" component={TravelDetailPage} />
        <Route path="certCallback" component={CertCallbackPage} />
        <Route path="unregistering" component={UnregisteringPage} />

        <Route path="error" component={ErrorPage} />
        <Route path="payResult" component={PayResultPage} />

        <Route path="autoRecharge" component={AutoRechargePage} />
        <Route path="autoRechargeEdit" component={AutoRechargeEditPage} />

        <Route path="unavailable" component={ServiceUnavailablePage} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
