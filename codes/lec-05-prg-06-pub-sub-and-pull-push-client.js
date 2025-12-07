const zmq = require("zeromq");

async function main() {
  const subscriber = new zmq.Subscriber();
  subscriber.subscribe("");
  subscriber.connect("tcp://localhost:5557");
  const publisher = new zmq.Push();
  publisher.connect("tcp://localhost:5558");

  handleIncomingMessages(subscriber);
  setInterval(async () => {
    const rand = Math.floor(Math.random() * 100) + 1;
    if (rand < 10) {
      await publisher.send(String(rand));
      console.log("I: sending message", rand);
    }
  }, 100);
}

async function handleIncomingMessages(subscriber) {
  for await (const [message] of subscriber) {
    console.log("I: received message", message.toString());
  }
}

main();
