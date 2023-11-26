class Task {
    constructor(name, duration) {
      this.name = name;
      this.duration = duration;
    }
  }
  
  class Scheduler {
    constructor() {
      this.queue = [];
    }
  
    addTask(task) {
      this.queue.push(task);
      this.queue.sort((a, b) => a.duration - b.duration); // Sort tasks by duration
    }
  
    runTasks() {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        console.log(`Running task '${task.name}' for ${task.duration} seconds`);
        // Simulate task execution
        setTimeout(() => {
          console.log(`Task '${task.name}' completed`);
        }, task.duration * 1000);
      }
    }
  }
  
  // Example usage
  const scheduler = new Scheduler();
  
  const task1 = new Task('Task 1', 5);
  const task2 = new Task('Task 2', 3);
  const task3 = new Task('Task 3', 8);
  
  scheduler.addTask(task1);
  scheduler.addTask(task2);
  scheduler.addTask(task3);
  
  scheduler.runTasks();
  