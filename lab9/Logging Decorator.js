const LOG_LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };

let currentLevel = LOG_LEVELS.DEBUG;

function log(level = "INFO") {
  return function(fn) {
    return async function(...args) {
      const shouldLog = LOG_LEVELS[level] >= currentLevel;
      const timestamp = () => new Date().toISOString();

      if (shouldLog && level !== "ERROR") {
        console.log(`[${timestamp()}] [${level}] ${fn.name} called with:`, args);
      }

      const start = Date.now();

      try {
        const result = await fn(...args);
        const ms = Date.now() - start;

        if (shouldLog && level !== "ERROR") {
          console.log(`[${timestamp()}] [${level}] ${fn.name} returned:`, result, `(${ms}ms)`);
        }

        return result;
      } catch (err) {
        const ms = Date.now() - start;
        console.log(`[${timestamp()}] [ERROR] ${fn.name} failed after ${ms}ms:`, err.message);
        throw err;
      }
    };
  };
}

function setLogLevel(level) {
  currentLevel = LOG_LEVELS[level];
}

function add(a, b) {
  return a + b;
}

async function fetchUser(id) {
  await new Promise(r => setTimeout(r, 100));
  return { id, name: "Alice" };
}

async function riskyOperation(x) {
  await new Promise(r => setTimeout(r, 50));
  if (x < 0) throw new Error("negative value not allowed");
  return x * 2;
}


const loggedAdd = log(add);
const loggedFetch = log("DEBUG")(fetchUser);
const loggedRisky = log("ERROR")(riskyOperation);

async function main() {
  console.log("=== INFO level ===");
  await loggedAdd(2, 3);

  console.log("\n=== DEBUG level (async) ===");
  await loggedFetch(1);

  console.log("\n=== ERROR level - success (no output) ===");
  await loggedRisky(5);

  console.log("\n=== ERROR level - failure ===");
  try {
    await loggedRisky(-1);
  } catch (err) {
    console.log("caught:", err.message);
  }

  console.log("\n=== set level to ERROR (suppress DEBUG and INFO) ===");
  setLogLevel("ERROR");
  await loggedAdd(10, 20);
  await loggedFetch(2);
  console.log("(no logs above = correct)");
}

main();