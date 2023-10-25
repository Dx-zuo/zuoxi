import axios from 'axios';
import qs from 'qs';
const baseURL = 'https://120.26.100.20'; // 服务器地址
// const ENV = 'test'; // prod: 生产 dev: 测试
const instance = axios.create({
  baseURL: `${baseURL}`,
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
});
export async function getServiceInfo(data: { id: any; }) {
  const options = buildOptions(data, '/api/get_service_info');
  return instance(options);
}

function buildOptions(data:any, url:string, method?:string) {
  const options:any = {
    method: method || 'POST',
    url,
  };
  if (options.method === 'GET') {
    options.params = data;
  } else {
    options.data = qs.stringify(data);
  }
  return options;
}
