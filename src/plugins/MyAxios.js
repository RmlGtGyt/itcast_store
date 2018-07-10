import axios from 'axios';

const MyAxios = {};
MyAxios.install = function (Vue) {
  // 创建自定义的axios实例
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  });

  // Add a request interceptor
  // 添加请求拦截器
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (config.url.toLowerCase() !== 'login') {
      // 获取token
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  // 添加相应拦截器
  instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
  Vue.prototype.$http = instance;
};

export default MyAxios;
