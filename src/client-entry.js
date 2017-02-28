require('es6-promise').polyfill()
require('isomorphic-fetch')
import {
    app,
} from './app'
require('babel-polyfill')

// prime the store with server-initialized state. the state is determined during
// SSR and inlined in the page markup. FIXME:
// 这一行代码会导致vuex-router-sync在非服务器端运行时报route不存在的错误. 如果确定是运行在Server render模式下就应该开启
// https://github.com/vuejs/vuex-router-sync/issues/27 __DEV__ &&
// store.replaceState(window.__INITIAL_STATE__) actually mount to DOM
app.$mount('#app')
