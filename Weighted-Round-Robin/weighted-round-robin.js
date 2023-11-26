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
  
  // Example usage:
  const servers = [
    { name: 'Server1', weight: 3, originalWeight: 3 },
    { name: 'Server2', weight: 2, originalWeight: 2 },
    { name: 'Server3', weight: 1, originalWeight: 1 },
  ];
  
  const wrr = new WeightedRoundRobin(servers);
  
  // Simulate requests
  for (let i = 0; i < 10; i++) {
    const selectedServer = wrr.getNextServer();
    console.log(`Request ${i + 1} routed to ${selectedServer.name}`);
  }
  
  // Add a new server dynamically
  const newServer = { name: 'Server4', weight: 4, originalWeight: 4 };
  wrr.addServer(newServer);
  
  console.log('After adding Server4:');
  for (let i = 0; i < 10; i++) {
    const selectedServer = wrr.getNextServer();
    console.log(`Request ${i + 1} routed to ${selectedServer.name}`);
  }
  