import Vue from 'vue'

export default (client) => ({
    namespaced: true,
    state: {
        indexState: 'indexState',
    },
    actions: {
        indexActions({commit}) {
            return commit('indexActionsSuc')
        },
    },
    mutations: {
        indexActionsSuc(state, data) {
            state.indexState = data
        }
    },
    getters: {},
})
