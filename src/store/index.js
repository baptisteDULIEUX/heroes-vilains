import { getAllOrgs, getOrgById, createOrg } from '@/services/org.service';
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orgPassword: null,
    heroAliases: [], 
    currentHero: null, 
    teams: [],
    currentTeam: null, 
    orgNames: [], 
    currentOrg: null 
  },
  getters: {
    getOrgPassword: state => state.orgPassword,
    getHeroAliases: state => state.heroAliases,
    getCurrentHero: state => state.currentHero,
    getTeams: state => state.teams,
    getCurrentTeam: state => state.currentTeam,
    getOrgNames: state => state.orgNames,
    getCurrentOrg: state => state.currentOrg,
  },
  mutations: {
    setSecret(state, secret) {
      state.secret = secret;
    },
    setOrgPassword(state, password) {
      console.log('Setting orgPassword:', password); // Debug
      state.orgPassword = password; // Met à jour orgPassword dans le state
    },
    setHeroAliases(state, aliases) {
      state.heroAliases = aliases;
    },
    setCurrentHero(state, hero) {
      state.currentHero = hero;
    },
    setTeams(state, teams) {
      state.teams = teams;
    },
    setCurrentTeam(state, team) {
      state.currentTeam = team;
    },
    setOrgNames(state, names) {
      state.orgNames = names;
    },
    setCurrentOrg(state, org) {
      state.currentOrg = org;
    }
  },
  actions: {
    async updateOrgPassword({ commit }, secret) {
      console.log('Updating org password:', secret); // Debug
      commit('setOrgPassword', secret);
    },

    // Récupère la liste des organisations depuis l'API
    async fetchOrgNames({ commit }) {
      try {
        console.log('fetchOrgNames')
        const response = await getAllOrgs(); 
        commit('setOrgNames', response.data); 
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    },
  
    // Récupère les détails d'une organisation spécifique
    async fetchOrgById({ commit }, {orgId, orgSecret}) {
      try {
        console.log('secret :' + orgSecret)
        const response = await getOrgById(orgId, orgSecret); 
        commit('setCurrentOrg', response.data);
        commit('setOrgPassword', orgSecret); 
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    },
  
    // Crée une nouvelle organisation
    async createOrg({ dispatch }, orgData) {
      try {
        await createOrg(orgData); 
        await dispatch('fetchOrgNames');
      } catch (error) {
        console.error('Error creating organization:', error);
      }
    },
  
    // Récupère la liste des équipes depuis l'API
    async fetchTeams({ commit }) {
      try {
        const response = await this.$axios.get('/teams/get'); 
        commit('setTeams', response.data);  
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    },
  
    // Récupère les détails d'une équipe spécifique
    async fetchTeamById({ commit }, teamId) {
      try {
        const response = await this.$axios.get(`/teams/getbyid/${teamId}`); // Remplacez par votre méthode API
        commit('setCurrentTeam', response.data); // Met à jour l'équipe sélectionnée
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    },
  
    // Crée une nouvelle équipe
    async createTeam({ dispatch }, teamData) {
      try {
        await this.$axios.post('/teams/create', teamData); // Remplacez par votre méthode API
        await dispatch('fetchTeams'); // Rafraîchit la liste des équipes
      } catch (error) {
        console.error('Error creating team:', error);
      }
    },
  },
  modules: {
  }
})