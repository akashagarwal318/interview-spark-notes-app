import ApiService from './api.js';

class SubjectService {
    async getSubjects() {
        console.log('Fetching subjects...');
        const res = await ApiService.get('/subjects');
        console.log('Fetched subjects response:', res);
        return res.data.subjects || [];
    }

    async createSubject(name, label) {
        console.log('Creating subject:', name);
        const res = await ApiService.post('/subjects', { name, label });
        console.log('Create subject response:', res);
        return res.data.subject;
    }

    async deleteSubject(name) {
        return ApiService.delete(`/subjects/${name}`);
    }

    async syncSubjects() {
        const res = await ApiService.post('/subjects/sync');
        return res.data.subjects || [];
    }
}

export default new SubjectService();
