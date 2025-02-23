import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically add admin header for protected train routes (POST, PUT, DELETE)
api.interceptors.request.use(
  (config) => {
    if (
      config.url &&
      config.url.includes('/trains') &&
      ['post', 'put', 'delete'].includes(config.method)
    ) {
      config.headers['x-admin-auth'] = 'adminsecret';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
