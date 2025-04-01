import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import OrgListView from '../views/OrgListView.vue'
import OrgDetailView from '../views/OrgDetailView.vue'
import TeamListView from '../views/TeamListView.vue'
import TeamDetailView from '../views/TeamDetailView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView 
  },
  {
    path: '/organizations',
    name: 'orgList',
    component: OrgListView 
  },
  {
    path: '/organizations/:id',
    name: 'orgDetail',
    component: OrgDetailView, 
    props: true 
  },
  {
    path: '/teams',
    name: 'teamList',
    component: TeamListView 
  },
  {
    path: '/teams/:id',
    name: 'teamDetail',
    component: TeamDetailView, 
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router