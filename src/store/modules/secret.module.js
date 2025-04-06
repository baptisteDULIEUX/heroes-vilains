import { addTeamToOrg, removeTeamFromOrg } from '@/services/org.service'

export default {
    namespaced: true,
    state: {
        orgPassword: "nous sommes mechants"
    },
    getters: {
        getOrgPassword: state => state.orgPassword
    },
    mutations: {
        setOrgPassword(state, password) {
            state.orgPassword = password
        }
    },
    actions: {
        async updateOrgPassword({ commit }, secret) {
            commit('setOrgPassword', secret)
        },

        async addTeamToOrg({ dispatch }, { orgId, orgSecret, teamId }) {
            try {
                await addTeamToOrg(teamId, orgSecret)
                await dispatch('app/fetchOrgById', { orgId, orgSecret }, { root: true })
            } catch (error) {
                console.error('Error adding team to org:', error)
                throw error
            }
        },

        async deleteTeamFromOrg({ dispatch }, { orgId, orgSecret, teamId }) {
            try {
                await removeTeamFromOrg(teamId, orgSecret)
                await dispatch('app/fetchOrgById', { orgId, orgSecret }, { root: true })
            } catch (error) {
                console.error('Error deleting team from org:', error)
                throw error
            }
        }
    }
}