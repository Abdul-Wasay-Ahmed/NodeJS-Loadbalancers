const http = require('http');

class RoundRobinScheduler {
  constructor() {
    this.queue = [];
  }

  addTask(task) {
    this.queue.push(task);
  }

  run() {
    const server = http.createServer((req, res) => {
      if (this.queue.length > 0) {
        const task = this.queue.shift();
        task(req, res);
        this.queue.push(task); // Move the task to the end of the queue
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('No available tasks to handle the request');
      }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
      console.log(`Round-Robin Server listening on port ${PORT}`);
    });
  }
}

// Example usage
const scheduler = new RoundRobinScheduler();

// Example tasks
const task1 = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Task 1 executed\n');
};

const task2 = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Task 2 executed\n');
};

const task3 = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Task 3 executed\n');
};

// Add tasks to the scheduler
scheduler.addTask(task1);
scheduler.addTask(task2);
scheduler.addTask(task3);

// Start the scheduler
scheduler.run();
module.exports = RoundRobinScheduler;