import fetch from 'isomorphic-fetch';
import LogicError from './logic-error';

const methods = ['get', 'post', 'put', 'patch', 'del'];
const APP_JSON_CONTENT_TYPE = 'application/json;charset=utf-8';
const inBrowser = typeof window !== 'undefined'

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    return `/api${adjustedPath}`;
}

function timeout(secs, promise) {
    return new Promise((resolve, reject) => {
        let timeout = setTimeout(() => reject(new Error("fetch timeout arrive!")), secs);
        promise.then(resolve, reject);
    });
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
function _ApiClient() {

    methods.forEach((method) =>
        this[method] = (path, {
            params,
            data
        } = {}) => new Promise((resolve, reject) => {
            const options = {
                method: method,
                credentials: 'include',
                timeout: 10000,
                headers: {
                    'Content-Type': APP_JSON_CONTENT_TYPE,
                    'Accept': APP_JSON_CONTENT_TYPE,
                }
            };

            if (data) {
                options.body = JSON.stringify(data, (key, value) => {
                    if (value == null) {
                        return undefined;
                    } else {
                        return value;
                    }
                });
            }
            let url = formatUrl(path);
            if (params) {
                url += Object.keys(params).filter((key) => params[key] != null).reduce((acc, key) => (acc += `${key}=${params[key]}&`), "?");
                url = url.slice(0, url.length - 1);
            }

            return fetch(url, options).then(response => {
                    if (~[401, 403, 404].indexOf(response.status)) {
                        // console.error(`${TAG}${response.url} status: ${response.status}, statusText:${response.statusText}`);
                        return reject(new LogicError({
                            status: response.status,
                            message: `fetch ${url} fail, status=${response.status}, statusText=${response.statusText}`,
                        }));
                    } else if (response.status === 418) {
                        if (inBrowser) {
                            window.location.reload();
                        } else {
                            //   console.error('Unexpected http status 418 when fetching via server side!');
                        }
                    } else {
                        return response.json().then(json => ({
                            json,
                            response
                        }));
                    }
                })
                .then(({
                    json,
                    response
                }) => {
                    // console.log("response.ok: ", response.ok, ", response.status: ", response.status);
                    if (!response.ok && response.status > 400) {
                        // console.error(`${TAG}${response.url} status: ${response.status}, response: `, response.json());
                        reject(new LogicError({
                            code: response.status,
                            message: json.message,
                        }));
                    }
                    /*else if ((json.code !== 200 && json.code !== '200') && (json.code !== 0 && json.code !== '0')) {
                                           // console.error(`${TAG}${response.url} code: ${json.code}, msg: `, json.msg);
                                           reject(new LogicError({
                                               code: json.code,
                                               msg: json.msg,
                                           }));
                                       }*/
                    else {
                        // console.log(`${TAG}${response.url} status: ${response.status}, statusText:${response.statusText}`);
                        resolve(json);
                    }
                });
        }));
}

const ApiClient = _ApiClient;

export default ApiClient;
