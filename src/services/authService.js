import ApiService from './api.js';

class AuthService {
  async signup({ name, email, password }) {
    const res = await ApiService.post('/auth/signup', { name, email, password });
    return res.data?.user || res.user;
  }
  async login({ email, password }) {
    const res = await ApiService.post('/auth/login', { email, password });
    const data = res.data || res;
    if (data.token) {
      localStorage.setItem('ia_token', data.token);
      if (data.user) localStorage.setItem('ia_user', JSON.stringify(data.user));
    }
    return data;
  }
  async me() {
    const res = await ApiService.get('/auth/me');
    return res.data?.user || res.user;
  }
  logout() {
    localStorage.removeItem('ia_token');
    localStorage.removeItem('ia_user');
  }
}

export default new AuthService();
