/*const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const app = express();

const sslOptions = {
  key: fs.readFileSync('path/to/your/ssl/key.pem'),
  cert: fs.readFileSync('path/to/your/ssl/cert.pem'),
};

// Proxy configuration
const apiProxy = createProxyMiddleware({
  target: 'https://ik.olleco.net',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
  secure: false,
});

app.use('/api', apiProxy);

https.createServer(sslOptions, app).listen(3001, () => {
  console.log('Proxy server running on https://localhost:3001');
});*/
