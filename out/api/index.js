"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const qs_1 = require("qs");
const baseURL = 'https://service-47lwrspx-1320422074.sh.apigw.tencentcs.com'; // 服务器地址
const ENV = 'test'; // prod: 生产 dev: 测试
const instance = axios_1.default.create({
    baseURL: `${baseURL}/${ENV}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
});
https: //zipx.0i0.lol/?id=48da2a1f-190c-4793-9993-0d1a8da58974#/login
 {
    async function getServiceInfo(data) {
        const options = buildOptions(data, '/api/get_service_info');
        return instance(options);
    }
    exports.getServiceInfo = getServiceInfo;
}
function buildOptions(data, url, method) {
    const options = {
        method: method || 'POST',
        url,
    };
    if (options.method === 'GET') {
        options.params = data;
    }
    else {
        options.data = qs_1.default.stringify(data);
    }
    return options;
}
