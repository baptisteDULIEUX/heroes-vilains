import { getAllOrgs, getOrgById, createOrg } from '@/services/org.service';
import { getAllTeams, createTeam } from '@/services/team.service';

export default {
    namespaced: true,
    state: {
        orgNames: [],
        currentOrg: null,
        teams: [],
        currentTeam: null,
    },
    getters: {
        getOrgNames: state => state.orgNames,
        getCurrentOrg: state => state.currentOrg,
        getTeams: state => state.teams,
        getCurrentTeam: state => state.currentTeam,
        getTeamById: state => teamId => {
            console.log("getTeamById: Searching for ID:", teamId);
            console.log("getTeamById: Teams in state:", state.teams);
            const team = state.teams.find(team => team._id === teamId);
            console.log("getTeamById: Found team:", team);
            return team;
        }
    },
    mutations: {
        setOrgNames(state, names) {
            state.orgNames = names;
        },
        setCurrentOrg(state, org) {
            state.currentOrg = org;
        },
        setTeams(state, teams) {
            state.teams = teams;
        },
        setCurrentTeam(state, team) {
            state.currentTeam = team;
        },
    },
    actions: {
        async selectTeam({ commit, getters }, teamOrId) {
            if (!teamOrId) {
                console.error('Invalid teamOrId: undefined');
                return; // ou throw new Error('Invalid teamOrId');
            }

            let teamId;
            if (typeof teamOrId === 'object' && teamOrId && teamOrId._id) {
                teamId = teamOrId._id;
                console.log('Selecting team with ID (object):', teamId);
            } else if (typeof teamOrId === 'string') {
                teamId = teamOrId;
                console.log('Selecting team with ID (string):', teamId);
            } else {
                console.error('Invalid teamOrId:', teamOrId);
                return; // ou throw new Error('Invalid teamOrId');
            }

            let team = getters.getTeamById(teamId);

            if (!team) {
                console.warn('Team not found in store, trying full refresh...');
                await this.dispatch('app/fetchTeams');
                team = getters.getTeamById(teamId);

                if (!team) {
                    throw new Error(`Team ${teamId} not found`);
                }
            }

            commit('setCurrentTeam', team);
            return team;
        },
        async selectOrganization({ commit }, org) {
            commit('setCurrentOrg', org);
        },

        async fetchOrgNames({ commit }) {
            try {
                const response = await getAllOrgs();
                commit('setOrgNames', response.data);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        },

        async fetchOrgById({ commit }, { orgId, orgSecret }) {
            try {
                const response = await getOrgById(orgId, orgSecret);
                commit('setCurrentOrg', response.data);
            } catch (error) {
                console.error('Error fetching organization details:', error);
                throw error;
            }
        },

        async createOrg({ dispatch }, orgData) {
            try {
                await createOrg(orgData);
                await dispatch('fetchOrgNames');
            } catch (error) {
                console.error('Error creating organization:', error);
                throw error;
            }
        },

        async fetchTeams({ commit }) {
            try {
                const response = await getAllTeams();
                commit('setTeams', response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
                throw error;
            }
        },

        async createTeam({ dispatch }, teamData) {
            try {
                await createTeam(teamData);
                await dispatch('fetchTeams');
            } catch (error) {
                console.error('Error creating team:', error);
                throw error;
            }
        },
    },
};