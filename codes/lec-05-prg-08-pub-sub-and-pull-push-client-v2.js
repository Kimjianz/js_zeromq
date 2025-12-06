const zmq = require("zeromq");

async function main() {
  const subscriber = new zmq.Subscriber();
  subscriber.subscribe("");
  subscriber.connect("tcp://localhost:5557");
  const publisher = new zmq.Push();
  publisher.connect("tcp://localhost:5558");

  const clientID = process.argv[2] ? process.argv[2] : "client1";

  handleIncomingMessages(subscriber, clientID);

  setInterval(() => {
    (async () => {
      const rand = Math.floor(Math.random() * 100) + 1;

      if (rand < 10) {
        await sleep(1000);
        const msg = `(${clientID}:ON)`;
        await publisher.send(msg);
        console.log(`${clientID}: send status - activated`);
      } else if (rand > 90) {
        await sleep(1000);
        const msg = `(${clientID}:OFF)`;
        await publisher.send(msg);
        console.log(`${clientID}: send status - deactivated`);
      }
    })();
  }, 100);
}

async function handleIncomingMessages(subscriber, clientID) {
  for await (const [message] of subscriber) {
    console.log(`${clientID}: receive status => ${message.toString()}`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
