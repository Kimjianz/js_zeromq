const zmq = require("zeromq");

async function main() {
  const clientId = process.argv[2] || "client1";

  const socket = new zmq.Dealer();
  socket.routingId = clientId;  
  await socket.connect("tcp://localhost:5570");
  console.log(`Client ${clientId} started`);

  let reqs = 0;

  while (true) {
    reqs += 1;
    console.log(`Req #${reqs} sent..`);

    const body = `request #${reqs}`;
    await socket.send(body);

    const [msg] = await socket.receive();
    console.log(`${clientId} received: ${msg.toString()}`);

    await sleep(1000);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
