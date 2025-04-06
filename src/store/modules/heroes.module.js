import { getAllHeroes, getHeroById } from '@/services/hero.service';
import { addHeroesToTeam, removeHeroesFromTeam} from "@/services/team.service";

export default {
    namespaced: true,
    state: {
        heroAliases: [],
        currentHero: null
    },
    getters: {
        getHeroAliases: state => state.heroAliases,
        getCurrentHero: state => state.currentHero
    },
    mutations: {
        setHeroAliases(state, aliases) {
            state.heroAliases = aliases
        },
        setCurrentHero(state, hero) {
            state.currentHero = hero
        }
    },
    actions: {
        async fetchHeroes({ commit }) {
            try {
                const response = await getAllHeroes()
                commit('setHeroAliases', response.data)
                return response.data
            } catch (error) {
                console.error('Error fetching heroes:', error)
                throw error
            }
        },

        async fetchHeroById({ commit, rootGetters }, heroId) {
            try {
                const orgSecret = rootGetters['secret/getOrgPassword'];
                const response = await getHeroById(heroId, orgSecret);
                commit('setCurrentHero', response.data);
                return response.data;
            } catch (error) {
                console.error('Error fetching hero details:', error);
                throw error;
            }
        },

        async addHeroToTeam({ commit }, { teamId, heroId }) {
            try {
                const response = await addHeroesToTeam({ idHero: heroId, idTeam: teamId })
                commit('setHeroAliases', response)
            } catch (error) {
                console.error('Error adding hero to team:', error)
                throw error
            }
        },

        async removeHeroFromTeam({ commit }, { teamId, heroId }) {
            try {
                const response = await removeHeroesFromTeam({ heroId, teamId })
                commit('setHeroAliases', response)
            } catch (error) {
                console.error('Error removing hero from team:', error)
                throw error
            }
        }
    }
}