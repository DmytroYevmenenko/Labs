const LOG_LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };

let currentLevel = LOG_LEVELS.DEBUG;


const formatters = {
  text(entry) {
    return `[${entry.timestamp}] [${entry.level}] ${entry.fnName} | args: ${JSON.stringify(entry.args)} | result: ${JSON.stringify(entry.result)} | ${entry.ms}ms`;
  },

  json(entry) {
    return JSON.stringify(entry);
  },

  short(entry) {
    return `${entry.level} ${entry.fnName}() ${entry.ms}ms`;
  }
};

let currentFormatter = "text";

function setFormatter(name) {
  if (!formatters[name]) throw new Error(`unknown formatter: ${name}`);
  currentFormatter = name;
  console.log(`formatter set to ${name}`);
}

function setLogLevel(level) {
  currentLevel = LOG_LEVELS[level];
  console.log(`log level set to ${level}`);
}




function log(level = "INFO") {
  return function(fn) {
    return async function(...args) {
      const shouldLog = LOG_LEVELS[level] >= currentLevel;
      const timestamp = new Date().toISOString();
      const start = Date.now();

      if (shouldLog && level !== "ERROR") {
        console.log(`[${timestamp}] [${level}] ${fn.name} called with:`, args);
      }

      try {
        const result = await fn(...args);
        const ms = Date.now() - start;

        if (shouldLog && level !== "ERROR") {
          const entry = {
            timestamp,
            level,
            fnName: fn.name,
            args,
            result,
            ms
          };
          console.log(formatters[currentFormatter](entry));
        }

        return result;
      } catch (err) {
        const ms = Date.now() - start;
        const entry = {
          timestamp,
          level: "ERROR",
          fnName: fn.name,
          args,
          error: err.message,
          ms
        };
        console.log(formatters[currentFormatter](entry));
        throw err;
      }
    };
  };
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


const loggedAdd = log("INFO")(add);
const loggedFetch = log("DEBUG")(fetchUser);
const loggedRisky = log("ERROR")(riskyOperation);

async function main() {
  console.log("=== text formatter (default) ===");
  await loggedAdd(2, 3);
  await loggedFetch(1);

  console.log("\n=== json formatter ===");
  setFormatter("json");
  await loggedAdd(5, 5);
  await loggedFetch(2);

  console.log("\n=== short formatter ===");
  setFormatter("short");
  await loggedAdd(1, 1);

  console.log("\n=== error with json formatter ===");
  setFormatter("json");
  try {
    await loggedRisky(-1);
  } catch (err) {
    console.log("caught:", err.message);
  }
}

main();