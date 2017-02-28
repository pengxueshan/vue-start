import Vue from 'vue'
import Vuex from 'vuex'
import ModIndex from './mod-index'
import ApiClient from '../utils/api-client'
import Cookie from '../utils/cookie'

import {
    fetchData,
} from './api'
Vue.use(Vuex);

Vue.config.debug = true;
const TAG = '[store-global]::';
const client = new ApiClient();

const store = new Vuex.Store({
    strict: Vue.config.debug,
    middlewares: Vue.config.debug ? [createLogger()] : [],
    modules: {
        index: ModIndex(client),
    },
    state: {
        globalState: 'globalState',
    },

    actions: {
        globalActions({
            commit,
            dispatch
        }) {
            return commit('actionsSuc')
        },
    },

    mutations: {
        actionsSuc(state, data) {
            state.globalState = data
        }
    },

    getters: {}
})

export default store
