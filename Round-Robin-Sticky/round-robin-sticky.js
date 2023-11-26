const http = require('http');

class StickyRoundRobinScheduler {
  constructor() {
    this.servers = [];
    this.currentServerIndex = 0;
    this.stickyAssignments = new Map();
  }

  addServer(server) {
    this.servers.push(server);
  }

  assignTaskToServer(task, clientId) {
    const server = this.stickyAssignments.get(clientId) || this.getNextServer();
    this.stickyAssignments.set(clientId, server);
    server.addTask(task);
  }

  getNextServer() {
    const server = this.servers[this.currentServerIndex];
    this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;
    return server;
  }

  run() {
    this.servers.forEach((server, index) => {
      const PORT = 3000 + index;
      server.listen(PORT, () => {
        console.log(`Server ${index + 1} listening on port ${PORT}`);
      });
    });
  }
}

class Server extends http.Server {
  constructor() {
    super((req, res) => {
      if (this.queue.length > 0) {
        const task = this.queue.shift();
        task(req, res);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('No available tasks to handle the request');
      }
    });

    this.queue = [];
  }

  addTask(task) {
    this.queue.push(task);
  }
}

// Example usage
const scheduler = new StickyRoundRobinScheduler();

// Example servers
const server1 = new Server();
const server2 = new Server();
const server3 = new Server();

// Add servers to the scheduler
scheduler.addServer(server1);
scheduler.addServer(server2);
scheduler.addServer(server3);

// Example tasks
const task1 = (req, res) => res.end('Task 1 executed\n');
const task2 = (req, res) => res.end('Task 2 executed\n');
const task3 = (req, res) => res.end('Task 3 executed\n');

// Assign tasks to servers using Sticky Round Robin
scheduler.assignTaskToServer(task1, 'client1');
scheduler.assignTaskToServer(task2, 'client2');
scheduler.assignTaskToServer(task3, 'client3');

// Start the scheduler and servers
scheduler.run();
