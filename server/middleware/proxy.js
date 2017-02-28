'use strict';

var httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxy(),
    config = require('../../config');

const YYYY_MM_DD = 1;
const MM_DD_HH_SS = 2;
const YYYY_MM_DD_HH_MM = 3; // default
const YYYY_MM_DD_HH_MM_SS = 4;


function getDateStr(timestamp, mode = 3) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = `${('0' + (d.getMonth() + 1)).slice(-2)}`;
    const day = `${('0' + d.getDate()).slice(-2)}`
    const hour = `${('0' + d.getHours()).slice(-2)}`
    const minute = `${('0' + d.getMinutes()).slice(-2)}`
    const second = `${('0' + d.getSeconds()).slice(-2)}`
    switch (mode) {
        case YYYY_MM_DD:
            return `${year}-${month}-${day}`;
        case MM_DD_HH_SS:
            return `${month}-${day} ${hour}:${minute}`;
        case YYYY_MM_DD_HH_MM_SS:
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        case '':
            return `${month}-${day} ${hour}:${minute}`;
        case YYYY_MM_DD_HH_MM:
            return `${year}-${month}-${day} ${hour}:${minute}`;
        default:
            return `${year}-${month}-${day} ${hour}:${minute}`;
    }
}

module.exports = function (options) {
    if (typeof options === 'string') {
        options = {
            target: options
        };
    }
    console.log("proxy options: ", options);
    return function (req, res, next) {
        var _options = options;

        if (!options || !options.target) {
            var target = options[req.hostname];

            if (target) {
                _options = {
                    target: target
                }
            } else {
                return next('proxy host error.');
            }
        }

        // 干掉url最前面的斜杠，不然最后拼筹出来的url有问题
        req.url = req.url.replace(/\//, '');

        // 干掉header中的host，不然服务器的nginx会报错。
        delete req.headers.host;

        proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[${getDateStr(Date.now(), 4)}]`, 'Proxy requesting for: ' + req.originalUrl);
            console.log('Request status : ' + proxyRes.statusCode + ' ' + proxyRes.statusMessage + '\n')
        });
        if (req.originalUrl.startsWith('/wb/')) {
            proxy.web(req, res, {
                target: config.wbTarget
            }, function (err) {
                err.mod = 'proxy';
                next(err);
            });
        } else {
            proxy.web(req, res, _options, function (err) {
                err.mod = 'proxy';
                next(err);
            });
        }
    };
};
