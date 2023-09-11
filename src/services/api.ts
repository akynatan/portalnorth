import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false, // Isso permite que a solicitação ignore erros SSL
});

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  httpsAgent: agent,
  validateStatus: (status: number) => {
    if (status >= 200 && status < 300) {
      return true;
    }

    if (status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('@PortalNorth:token');
      localStorage.removeItem('@PortalNorth:user');

      window.location.href = '';
    }

    return false;
  },
});

export default api;
