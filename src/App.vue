<template>
    <div id="app" ref='app' class="wrap">
        <router-view></router-view>
    </div>
</template>
<script>
    import {
        mapState,
        mapActions
    } from 'vuex'

    export default {
        name: 'App',
        data() {
            return {}
        },
        computed: Object.assign({
            localState() {}
        }, mapState({
            globalState: 'globalState',
        })),
        methods: Object.assign({
            localActions() {}
        }, mapActions({
            globalActions: 'globalActions'
        }))
    }
</script>