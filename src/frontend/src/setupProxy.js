// eslint-disable-next-line import/no-extraneous-dependencies,@typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/dev',
        createProxyMiddleware({
            target: 'http://localhost:8088/',
            changeOrigin: true,
            pathRewrite: {
                '^/dev': '',
            },
        })
    )
}
