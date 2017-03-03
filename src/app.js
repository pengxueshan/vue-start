import Cookie from './utils/cookie'
window.Cookie = Cookie;

import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './app.vue'
import store from './store'
import router from './router'
import VideoPlayer from 'vue-video-player'
import {
    sync
} from 'vuex-router-sync'

import * as filters from './filters'
// import 'element-ui/lib/theme-default/index.css'

// register global utility filters.
Object
    .keys(filters)
    .forEach(key => {
        Vue.filter(key, filters[key])
    })

VideoPlayer.config({
    youtube: false, // default false
    switcher: false, // default true
    hls: true // default true
});

Vue.use(VideoPlayer);
Vue.use(ElementUI);

const inBrowser = typeof window !== 'undefined';
inBrowser ? require('sweetalert') : null;
// create the app instance. here we inject the router and store to all child
// components, making them available everywhere as `this.$router` and
// `this.$store`.
const app = new Vue({
    router: router,
    store,
    inBrowser,
    ...App // Object spread copying everything from App.vue
});

// app.$store.dispatch('getUserInfo')

// sync the router with the vuex store. this registers `store.state.route`
sync(store, app.$router);

// expose the app, the router and the store. note we are not mounting the app
// here, since bootstrapping will be different depending on whether we are in a
// browser or on the server.
export {
    app,
    router,
    store
}
