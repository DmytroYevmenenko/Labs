const EventEmitter = require("events");

const bus = new EventEmitter();

bus.on("message", (data) => {
  console.log("listener A got:", data);
});

bus.on("message", (data) => {
  console.log("listener B got:", data);
});

bus.emit("message", { text: "hello" });
bus.emit("message", { text: "world" });