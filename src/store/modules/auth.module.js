// store/modules/auth.module.js
import AuthService from '@/services/auth.service';

const state = {
    xsrfToken: null,
    userLogin: null,
};

const mutations = {
    setXsrfToken(state, token) {
        state.xsrfToken = token;
    },
    setUserLogin(state, login) {
        state.userLogin = login;
    },
    clearAuth(state) {
        state.xsrfToken = null;
        state.userLogin = null;
    },
};

const actions = {
    async login({ commit }, { login, password }) {
        commit('setLoading', true);
        commit('setError', null);
        try {
            const response = await AuthService.login(login, password);
            commit('setXsrfToken', response.data.xsrfToken);
            commit('setUserLogin', login);
            await this.dispatch('auth/getUserInfo');
        } catch (error) {
            commit('setError', error.message);
            throw error;
        } finally {
            commit('setLoading', false);
        }
    },
    async getUserInfo({ state }) {
        this.commit('setLoading', true);
        this.commit('setError', null);
        try {
            const response = await AuthService.getUser(state.userLogin);
            this.commit('setUserInfo', response.data);
            return response.data;
        } catch (error) {
            this.commit('setError', error.message);
            throw error;
        } finally {
            this.commit('setLoading', false);
        }
    },
    logout({ commit }) {
        commit('clearAuth');
    },
};

const getters = {
    isAuthenticated: state => !!state.xsrfToken,
    userLogin: state => state.userLogin,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};