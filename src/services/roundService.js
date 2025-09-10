import ApiService from './api.js';

class RoundService {
  async getRounds() {
    const res = await ApiService.get('/rounds');
    return res.data.rounds || [];
  }

  async createRound(name, label) {
    const res = await ApiService.post('/rounds', { name, label });
    return res.data.round;
  }

  async deleteRound(name) {
    return ApiService.delete(`/rounds/${name}`);
  }
}

export default new RoundService();