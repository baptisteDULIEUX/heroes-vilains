import store from '@/store';

export default (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.orgSecret) {
            next({ name: 'Auth' }); // Rediriger vers la page d'authentification
        } else {
            next(); // Autoriser l'accès à la route
        }
    } else {
        next(); // Autoriser l'accès aux routes qui ne nécessitent pas d'authentification
    }
};