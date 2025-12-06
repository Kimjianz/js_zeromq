const zmq = require("zeromq");

console.log("Publishing updates at weather server...");

async function main() {
  const socket = new zmq.Publisher();
  await socket.bind("tcp://*:5556");

  while (true) {
    const zipcode = Math.floor(Math.random() * 99999) + 1;
    const temperature = Math.floor(Math.random() * 215) - 80;
    const relhumidity = Math.floor(Math.random() * 50) + 10;

    await socket.send(`${zipcode} ${temperature} ${relhumidity}`);
  }
}

main();
