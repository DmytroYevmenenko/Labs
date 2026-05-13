const LOG_LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };

let currentLevel = LOG_LEVELS.DEBUG;

function log(fn) {
  return function(fn) {
    return function(...args) {
      const shouldLog = LOG_LEVELS[level] >= currentLevel;

      if (shouldLog) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level}] calling ${fn.name} with args:`, args);
      }

      const result = fn(...args);

      if (shouldLog) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level}] ${fn.name} returned:`, result);
      }

      return result;
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


const loggedAdd = log(add);
const loggedFetch = log("DEBUG")(fetchUser);

async function main() {
  loggedAdd(2, 3);

  console.log("\n--- async (with bug) ---");
  const result = loggedFetch(1);
  console.log("got:", result);
}

main();