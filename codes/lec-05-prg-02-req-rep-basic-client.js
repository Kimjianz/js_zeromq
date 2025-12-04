const zmq = require("zeromq");

async function main() {
  console.log("Connecting to hello world server…");
  const socket = new zmq.Request();
  socket.connect("tcp://localhost:5555");

  for (let request = 0; request < 10; request++) {
    console.log(`Sending request ${request} …`);
    await socket.send("Hello");

    const [message] = await socket.receive();
    console.log(`Received reply ${request} [ ${message.toString()} ]`);
  }
}
main();