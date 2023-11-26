const express = require('express');
const httpProxy = require('http-proxy');

class WeightedRoundRobin {
  constructor(servers) {
    this.servers = servers;
    this.totalWeight = this.calculateTotalWeight(servers);
    this.currentServerIndex = 0;
  }

  calculateTotalWeight(servers) {
    return servers.reduce((total, server) => total + server.weight, 0);
  }

  getNextServer() {
    let selectedServer = null;

    for (let i = 0; i < this.servers.length; i++) {
      this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;

      if (this.servers[this.currentServerIndex].weight >= 1) {
        selectedServer = this.servers[this.currentServerIndex];
        this.servers[this.currentServerIndex].weight--;

        if (this.servers[this.currentServerIndex].weight === 0) {
          this.servers[this.currentServerIndex].weight = this.servers[this.currentServerIndex].originalWeight;
        }

        break;
      }
    }

    return selectedServer;
  }

  addServer(server) {
    this.servers.push(server);
    this.totalWeight += server.weight;
  }

  removeServer(server) {
    const index = this.servers.indexOf(server);

    if (index !== -1) {
      this.totalWeight -= server.weight;
      this.servers.splice(index, 1);
    }
  }
}

const servers = [
  { name: 'Server1', weight: 3, originalWeight: 3, target: 'http://localhost:3001' },
  { name: 'Server2', weight: 2, originalWeight: 2, target: 'http://localhost:3002' },
  // Add more servers as needed
];

const wrr = new WeightedRoundRobin(servers);

const proxy = httpProxy.createProxyServer();

const app = express();

app.use((req, res) => {
  const selectedServer = wrr.getNextServer();

  if (selectedServer) {
    console.log(`Request routed to ${selectedServer.name}`);
    proxy.web(req, res, { target: selectedServer.target });
  } else {
    res.status(503).send('No available servers');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Load balancer listening on port ${port}`);
});
