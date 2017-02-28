import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import IndexView from '../views/index/index-view'

export default new Router({
    mode: 'history',
    base: __dirname,
    history: true,
    scrollBehavior: () => ({
        y: 0
    }),
    routes: [{
        path: '/redirect',
        component: RedirectView
    }, {
        path: '/index',
        component: IndexView
    }, {
        path: '*',
        redirect: '/index'
    }]
})
