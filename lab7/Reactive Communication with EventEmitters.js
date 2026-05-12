const EventEmitter = require("events");

const bus = new EventEmitter();

function createUser(name) {
  return {
    name,
    subscribe() {
      bus.on("message", (data) => {
        console.log(`${this.name} received: ${data.text}`);
      });
    },
    unsubscribe() {
      bus.off("message", () => {});
      console.log(`${this.name} unsubscribed (but not really)`);
    }
  };
}

function createLogger() {
  return {
    subscribe() {
      bus.on("message", (data) => {
        console.log(`[log] event at ${new Date().toISOString()}: ${data.text}`);
      });
    }
  };
}

async function main() {
  const alice = createUser("Alice");
  const bob = createUser("Bob");
  const logger = createLogger();

  alice.subscribe();
  bob.subscribe();
  logger.subscribe();
 bus.emit("message", { text: "first message" });

  await new Promise(r => setTimeout(r, 500));

  bob.unsubscribe();

  bus.emit("message", { text: "second message" });
}

main();