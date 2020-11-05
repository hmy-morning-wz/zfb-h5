import fetch from 'dva/fetch';
import config from './config';

const STATUS_OK = 200;
const STATUS_REDIRECT = 302;
const SERVICE_STOPPED = 405;

const CTOKEN_HEADER_NAME = 'COM_IOC_CTOKEN';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function getQueryString(params) {
  return Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

const JSON_HEADER = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const URLENCODE_HEADER = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json',
};

function request(url, options) {
  const noAutoJson = options.noAutoJson;

  const opts = Object.assign(options, {
    headers: (noAutoJson ? URLENCODE_HEADER : JSON_HEADER),
    credentials: 'include',
  });

  let finalUrl = url;

  const method = options.method;
  const body = options.body;

  if (method === 'GET' || method === 'DELETE') {
    if (body) {
      finalUrl = `${finalUrl}?${getQueryString(body)}`;
      delete opts.body;
    }
  } else {
    opts.body = noAutoJson ? getQueryString(body) : JSON.stringify(body);
  }

  if (global.ebusConfig) {
    opts.headers[CTOKEN_HEADER_NAME] = global.ebusConfig.jsession;
  }

  return fetch(finalUrl, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(error => ({ error }));
}


function apiToUrl(api) {
  return api.replace(/\./g, '/');
}

function getTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function apiRequest(api, options) {
  if (config.mock) {
    const url = `api/${apiToUrl(api)}`;
    return request(url, options);
  } else {
    const bizContent = JSON.stringify(options.body || {});
    const newBody = {
      service: api,
      biz_content: bizContent,
      v: (options.ver || '1.0'),
      timestamp: getTimestamp(),
    };

    return request(config.gateWay, { noAutoJson: true, ...options, body: newBody });
  }
}

export default {
  getQueryString,

  request,

  STATUS_OK,
  STATUS_REDIRECT,
  SERVICE_STOPPED,

  get: (url, body, options) => request(url, { method: 'GET', body, ...options }),
  post: (url, body, options) => request(url, { method: 'POST', body, ...options }),
  put: (url, body, options) => request(url, { method: 'PUT', body, ...options }),

  apiRequest,
  apiGet: (api, body, option) => apiRequest(api, { method: 'GET', body, ...option }),
  apiPost: (api, body, option) => apiRequest(api, { method: 'POST', body, ...option }),
};
