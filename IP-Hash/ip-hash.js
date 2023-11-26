const http = require('http');
const crypto = require('crypto');
const url = require('url');

// List of backend servers
const servers = [
  { host: 'localhost', port: 3001 },
  { host: 'localhost', port: 3002 },
  // Add more servers as needed
];

// Function to calculate the hash of the client's IP address
function calculateHash(ip) {
  const hash = crypto.createHash('md5');
  hash.update(ip);
  const hashValue = hash.digest('hex');
  return hashValue;
}

// Function to select a backend server based on the hash
function selectServer(hash) {
  const index = parseInt(hash, 16) % servers.length;
  return servers[index];
}

// Create a simple HTTP server for load balancing
const server = http.createServer((req, res) => {
  // Extract client IP address from request headers
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Calculate hash based on the client's IP
  const hash = calculateHash(clientIp);

  // Select a backend server based on the hash
  const selectedServer = selectServer(hash);

  // Proxy the request to the selected backend server
  const proxyReq = http.request(
    {
      host: selectedServer.host,
      port: selectedServer.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  // Handle errors during the proxy request
  proxyReq.on('error', (err) => {
    console.error(`Error proxying request to ${selectedServer.host}:${selectedServer.port}: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });

  // Proxy the incoming request
  req.pipe(proxyReq, { end: true });
});

// Start the load balancer server
const port = 3000;
server.listen(port, () => {
  console.log(`Load balancer listening on port ${port}`);
});
