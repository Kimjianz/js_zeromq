const zmq = require("zeromq");

async function startWorker(id) {
  const worker = new zmq.Dealer();
  await worker.connect("inproc://backend");
  console.log(`Worker#${id} started`);

  for await (const [ident, msg] of worker) {
    console.log(`Worker#${id} received ${msg.toString()} from ${ident.toString()}`);
    await worker.send([ident, msg]);
  }
}

async function main() {
  const args = process.argv;
  const numServer = parseInt(args[2] || "1", 10);

  const frontend = new zmq.Router();
  await frontend.bind("tcp://*:5570");

  const backend = new zmq.Dealer();
  await backend.bind("inproc://backend");

  for (let i = 0; i < numServer; i++) {
    startWorker(i);
  }

  const proxy = new zmq.Proxy(frontend, backend);
  await proxy.run(); 
}

main();
