const EventEmitter = require("events");

async function* generateData(totalRows, chunkSize, fail = false) {
  for (let i = 0; i < totalRows; i += chunkSize) {
    await new Promise(r => setTimeout(r, 200));

        if (fail && i === 20) {
        throw new Error("disk read error at row " + i);
        }
        const chunk = [];
        for (let j = i; j < Math.min(i + chunkSize, totalRows); j++) {
            chunk.push({ id: j, value: Math.floor(Math.random() * 100) });
        }

        yield chunk;
    }
}

function createStream(totalRows, chunkSize, fail = false) {
  const emitter = new EventEmitter();

  (async () => {
    for (let i = 0; i < totalRows; i += chunkSize) {
      await new Promise(r => setTimeout(r, 200));

      try {
        if (fail && i === 20) {
          throw new Error("stream read error at row " + i);
        }

        const chunk = [];
        for (let j = i; j < Math.min(i + chunkSize, totalRows); j++) {
          chunk.push({ id: j, value: Math.floor(Math.random() * 100) });
        }

        emitter.emit("data", chunk);
      } catch (err) {
        emitter.emit("error", err);
        return;
      }
    }
    emitter.emit("end");
  })();

  return emitter;
}

function processStream(stream) {
  return new Promise((resolve, reject) => {
    let processed = 0;
    let sum = 0;

    stream.on("data", (chunk) => {
      for (const row of chunk) {
        sum += row.value;
        processed++;
      }
      console.log(`  processed ${processed} rows`);
    });

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("end", () => {
      resolve({ processed, avg: Math.round(sum / processed) });
    });
  });
}

async function main() {
  const TOTAL = 50;
  const CHUNK = 5;
  console.log("=== generator: success case ===");
  try {
    let processed = 0;
    let sum = 0;
    for await (const chunk of generateData(TOTAL, CHUNK, false)) {
      for (const row of chunk) {
        sum += row.value;
        processed++;
      }
      console.log(`  processed ${processed} rows`);
    }
    console.log(`done: ${processed} rows, avg=${Math.round(sum / processed)}\n`);
  } catch (err) {
    console.error("generator failed:", err.message);
  }

  console.log("=== generator: error case ===");
  try {
    let processed = 0;
    for await (const chunk of generateData(TOTAL, CHUNK, true)) {
      processed += chunk.length;
      console.log(`  processed ${processed} rows`);
    }
    console.log("done:", processed);
  } catch (err) {
    console.error("generator failed:", err.message);
    console.log("consumer caught the error correctly\n");
  }
  console.log("=== event stream: success case ===");
  try {
    const result = await processStream(createStream(TOTAL, CHUNK, false));
    console.log(`done: ${result.processed} rows, avg=${result.avg}\n`);
  } catch (err) {
    console.error("stream failed:", err.message);
  }

  console.log("=== event stream: error case ===");
  try {
    const result = await processStream(createStream(TOTAL, CHUNK, true));
    console.log("done:", result);
  } catch (err) {
    console.error("stream failed:", err.message);
    console.log("consumer caught the error correctly");
  }
}

main();