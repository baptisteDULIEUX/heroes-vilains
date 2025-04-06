import axios from 'axios';

const API_URL = '/authapi/auth/signin';

export default {
    async login(login, password) {
        const response = await axios.post(API_URL, { login, password });
        return response.data;
    },

    async getUser(login) {
        const response = await axios.get(`/authapi/user/getuser/${login}`, {
            headers: {
                'x-xsrf-token': localStorage.getItem('xsrfToken'),
            },
        });
        return response.data;
    },
};