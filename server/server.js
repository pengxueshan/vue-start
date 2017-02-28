process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'
console.log("Current env: ", process.env.NODE_ENV)
const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const express = require('express')
const favicon = require('serve-favicon')
const serialize = require('serialize-javascript')
const compression = require('compression')
const config = require('../config/index')
const middleware = ['proxy', 'csrf', 'error', 'router']

const app = express()

// parse index.html template
// const html = (() => {
//   const template = fs.readFileSync(resolve('./index.html'), 'utf-8')
//   const i = template.indexOf('{{ APP }}')
//   // styles are injected dynamically via vue-style-loader in development
//   const style = isProd ? '<link rel="stylesheet" href="/dist/styles.css">' : ''
//   return {
//     head: template.slice(0, i).replace('{{ STYLE }}', style),
//     tail: template.slice(i + '{{ APP }}'.length)
//   }
// })()

// setup the server renderer, depending on dev/prod environment
if (isProd) {
    // create server renderer from real fs
    // const bundlePath = resolve('./static/dist/server-bundle.js')
    // renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
    require('../build/setup-dev-server')(app, bundle => {})
}

middleware.forEach(function (m) {
    middleware.__defineGetter__(m, function () {
        return require('./middleware/' + m);
    });
})

process.on('uncaughtException', function (err) {
    (app.get('logger') || console).error('Uncaught exception:\n', err.stack)
})

app.use(compression({
    threshold: 0
}))

app.use(favicon(resolve('./static/favicon.png')))

// app.use('/dist', express.static(resolve('../dist')))
// app.use('/', express.static(resolve('./static/dist')));
app.use('/dist', express.static(resolve('./static/dist')));
app.use('/lib', express.static(resolve('./static/lib')));
app.use('/webrebuild', express.static(resolve('../webrebuild/publish')));
app.use('/api', middleware.proxy(config.apiTarget));
app.use('/head_default.png', express.static(resolve('./static/head_default.png')));
app.get('*', (req, res, next) => res.sendFile(path.resolve(__dirname, './static/index.html')))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
