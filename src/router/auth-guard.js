import store from '@/store';

export default (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters['auth/isAuthenticated']) {
            next({ name: 'Auth' });
        } else {
            next();
        }
    } else {
        next();
    }
};