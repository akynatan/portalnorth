import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  validateStatus: (status: number) => {
    if (status >= 200 && status < 300) {
      return true;
    }

    if (status === 401 && window.location.pathname !== '/') {
      localStorage.removeItem('@AdminBizz:token');
      localStorage.removeItem('@AdminBizz:user');

      window.location.href = '';
    }

    return false;
  },
});

export default api;
