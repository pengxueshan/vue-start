<template>
    <div id="app" ref='app' class="wrap">
        vue start
    </div>
</template>
<script>
    import {
        mapState,
        mapActions
    } from 'vuex'

    export default {
        name: 'App',
        components: {
        },
        data() {
            return {}
        },

        computed: Object.assign({
            localState: 'localState'
        }, mapState({
            globalState: 'globalState',
        })),

        mounted() {
        },

        methods: Object.assign({
            localActions() {}
        }, mapActions({
            globalActions: 'globalActions'
        }))
    }
</script>