import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/HomeView.vue';
import Auth from '../views/AuthView.vue';
import Organizations from '../views/OrgListView.vue';
import Teams from '../views/TeamListView.vue';
import TeamDetailView from '../views/TeamDetailView.vue';
import authGuard from './auth-guard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/organizations',
    name: 'Organizations',
    component: Organizations,
    beforeEnter: authGuard, // Appliquer la garde de routage
    meta: { requiresAuth: true }, // Indiquer que la route nécessite une authentification
  },
  {
    path: '/teams',
    name: 'Teams',
    component: Teams,
    beforeEnter: authGuard, // Appliquer la garde de routage
    meta: { requiresAuth: true }, // Indiquer que la route nécessite une authentification
  },
  {
    path: '/teams/:id',
    name: 'TeamDetail',
    component: TeamDetailView,
    beforeEnter: authGuard, // Appliquer la garde de routage
    meta: { requiresAuth: true }, // Indiquer que la route nécessite une authentification
  },
  {
    path: '*',
    redirect: '/', // Rediriger vers la page d'accueil pour les routes non définies
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;