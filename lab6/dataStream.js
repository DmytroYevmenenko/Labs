async function* generateData(totalRows, chunkSize) {
  for (let i = 0; i < totalRows; i += chunkSize) {
    await new Promise(r => setTimeout(r, 200));

    const chunk = [];
    for (let j = i; j < Math.min(i + chunkSize, totalRows); j++) {
      chunk.push({ id: j, value: Math.floor(Math.random() * 100) });
    }

    yield chunk;
  }
}

async function main() {
  console.log("start processing...");

  let processed = 0;

  for await (const chunk of generateData(50, 5)) {
    for (const row of chunk) {
      processed++;
    }
    console.log(`processed ${processed} rows`);
  }

  console.log("done, total:", processed);
}

main();