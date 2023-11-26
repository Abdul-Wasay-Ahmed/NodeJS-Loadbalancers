const http = require('http');
const cluster = require('cluster');

const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  const server = http.createServer((req, res) => {
    // Simulating processing time with a random delay
    const processingTime = Math.random() * 1000;
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Worker ${process.pid} processed request in ${processingTime.toFixed(2)}ms\n`);
    }, processingTime);
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}
