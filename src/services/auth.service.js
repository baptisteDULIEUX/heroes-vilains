import axios from 'axios';

const axiosAuthapi = axios.create({
    baseURL: 'https://apidemo.iut-bm.univ-fcomte.fr/authapi',
});

axiosAuthapi.interceptors.request.use(config => {
    const xsrfToken = localStorage.getItem('xsrfToken');
    if (xsrfToken) {
        config.headers['x-xsrf-token'] = xsrfToken;
    }
    return config;
});

export default {
    async login(login, password) {
        const response = await axiosAuthapi.post('/auth/signin', { login, password });
        return response.data;
    },

    async getUser(login) {
        const response = await axiosAuthapi.get(`/user/getuser/${login}`);
        return response.data;
    },
};