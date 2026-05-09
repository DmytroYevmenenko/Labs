const EventEmitter = require("events");

async function* generateData(totalRows, chunkSize, fail = false) {
  for (let i = 0; i < totalRows; i += chunkSize) {
    await new Promise(r => setTimeout(r, 200));

    try {
        if (fail && i === 20) {
        throw new Error("disk read error at row " + i);
        }
            const chunk = [];
            for (let j = i; j < Math.min(i + chunkSize, totalRows); j++) {
            chunk.push({ id: j, value: Math.floor(Math.random() * 100) });
        }

            yield chunk;
            } catch (e) {
            console.error("error in producer:", e.message);
            return;
        }
    }
}

function createStream(totalRows, chunkSize, fail = false) {
  const emitter = new EventEmitter();

  (async () => {
    for (let i = 0; i < totalRows; i += chunkSize) {
      await new Promise(r => setTimeout(r, 200));

      if (fail && i === 20) {
        console.error("stream error at row " + i);
        return;
      }

      const chunk = [];
      for (let j = i; j < Math.min(i + chunkSize, totalRows); j++) {
        chunk.push({ id: j, value: Math.floor(Math.random() * 100) });
      }

      emitter.emit("data", chunk);
    }
    emitter.emit("end");
  })();

  return emitter;
}

async function main() {
  console.log("=== generator (with bug) ===");
  let processed = 0;
  for await (const chunk of generateData(50, 5, true)) {
    processed += chunk.length;
    console.log("processed:", processed);
  }
  console.log("total:", processed, "(expected 50)");
}

main();