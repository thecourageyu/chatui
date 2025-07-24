const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy for API 1
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'http://vllm:8000', // API 1 server
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' }, // Remove /api1 prefix when forwarding
    })
  );

  // Proxy for API 2
  app.use(
    '/mongodb',
    createProxyMiddleware({
      // target: 'http://localhost:5000', // API 2 server
      target: 'http://localhost:27018', // API 2 server
      changeOrigin: true,
      pathRewrite: { '^/mongodb': '' }, // Remove /api2 prefix when forwarding
      logLevel: 'debug' // ✅ this helps see what’s going on

    })
  );

  app.use(
    '/loginserver',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      logLevel: 'debug' // ✅ this helps see what’s going on
    })
  );
  // Add more proxies as needed
};
