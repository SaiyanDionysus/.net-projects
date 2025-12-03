import axios from 'axios';

const API_BASE_URL = 'http://localhost:5088/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const accountsAPI = {
    getAccounts: () => api.get('/accounts'),
    getTransactions: (accountId) => api.get(`/accounts/${accountId}/transactions`),
};

// В api.js добавьте:
api.interceptors.request.use(config => {
  console.log('🚀 Отправка запроса на:', config.url);
  console.log('📦 Данные:', config.data);
  console.log('🔧 Метод:', config.method);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('✅ Ответ от сервера:', response.status);
    return response;
  },
  error => {
    console.error('❌ Ошибка запроса:', {
      URL: error.config?.url,
      Метод: error.config?.method,
      Статус: error.response?.status,
      Сообщение: error.message,
      Ответ: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;