export default {
    namespaced: true,
    state: {
        errors: []
    },
    getters: {
        getErrors: state => state.errors
    },
    mutations: {
        ADD_ERROR(state, error) {
            state.errors.push(error)
        },
        CLEAR_ERRORS(state) {
            state.errors = []
        }
    },
    actions: {
        addError({ commit }, error) {
            commit('ADD_ERROR', error)
        },
        clearErrors({ commit }) {
            commit('CLEAR_ERRORS')
        }
    }
}