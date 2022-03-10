const { parentPort } = require('worker_threads');
parentPort.on('message', (task) => {
  // await new Promise(res => setTimeout(res, 1000));
  parentPort.postMessage(task.a + task.b);
});
