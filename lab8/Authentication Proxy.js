const https = require("https");


function createLogger() {
  const logs = [];
  return {
    log(entry) {
      const record = { ...entry, timestamp: new Date().toISOString() };
      logs.push(record);
      console.log(`[${record.timestamp}] [${entry.level || "info"}] ${entry.message}`);
    },
    getLogs() { return logs; }
  };
}


function createRateLimiter(maxPerSecond) {
  const timestamps = [];
  return {
    canProceed() {
      const now = Date.now();
      while (timestamps.length && timestamps[0] < now - 1000) {
        timestamps.shift();
      }
      if (timestamps.length >= maxPerSecond) {
        return false;
      }
      timestamps.push(now);
      return true;
    }
  };
}


const strategies = {
  apiKey(credentials) {
    return { "Authorization": `ApiKey ${credentials.key}` };
  },

  jwt(credentials) {
    if (credentials.expiresAt && Date.now() > credentials.expiresAt) {
      throw new Error("JWT token expired, need refresh");
    }
    return { "Authorization": `Bearer ${credentials.token}` };
  },

  oauth(credentials) {
    return {
      "Authorization": `Bearer ${credentials.accessToken}`,
      "X-OAuth-Scope": credentials.scope || "read"
    };
  }
};



function createProxy(strategy, credentials, options = {}) {
  const logger = createLogger();
  const rateLimiter = createRateLimiter(options.maxPerSecond || 5);
  let currentStrategy = strategy;
  let currentCredentials = credentials;

  function refreshToken() {
    logger.log({ level: "info", message: "refreshing JWT token..." });
    currentCredentials = {
      ...currentCredentials,
      token: "new-refreshed-token-" + Date.now(),
      expiresAt: Date.now() + 60000
    };
    logger.log({ level: "info", message: "token refreshed successfully" });
  }

  return {
    request(url, requestOptions = {}) {
      if (!rateLimiter.canProceed()) {
        logger.log({ level: "warn", message: `rate limit exceeded for ${url}` });
        throw new Error("rate limit exceeded");
      }

      if (!strategies[currentStrategy]) {
        throw new Error(`unknown strategy: ${currentStrategy}`);
      }

      let authHeaders;
      try {
        authHeaders = strategies[currentStrategy](currentCredentials);
      } catch (err) {
        if (currentStrategy === "jwt" && err.message.includes("expired")) {
          logger.log({ level: "warn", message: "token expired, refreshing..." });
          refreshToken();
          authHeaders = strategies[currentStrategy](currentCredentials);
        } else {
          throw err;
        }
      }

      const headers = {
        ...requestOptions.headers,
        ...authHeaders,
        "Content-Type": "application/json",
      };

      logger.log({
        level: "info",
        message: `${requestOptions.method || "GET"} ${url} [${currentStrategy}]`
      });

      return { url, headers, method: requestOptions.method || "GET" };
    },

    setStrategy(newStrategy, newCredentials) {
      currentStrategy = newStrategy;
      currentCredentials = newCredentials;
      logger.log({ level: "info", message: `switched to strategy: ${newStrategy}` });
    },

    getLogs() {
      return logger.getLogs();
    }
  };
}


async function main() {
  console.log("=== api key ===");
  const proxy1 = createProxy("apiKey", { key: "secret-123" });
  proxy1.request("https://api.example.com/data");

  console.log("\n=== jwt with expired token (auto refresh) ===");
  const proxy2 = createProxy("jwt", {
    token: "eyJ.expired.token",
    expiresAt: Date.now() - 10000
  });
  proxy2.request("https://api.example.com/profile");
  console.log("\n=== rate limiting ===");
  const proxy3 = createProxy("apiKey", { key: "key-456" }, { maxPerSecond: 3 });
  try {
    proxy3.request("https://api.example.com/1");
    proxy3.request("https://api.example.com/2");
    proxy3.request("https://api.example.com/3");
    proxy3.request("https://api.example.com/4");
  } catch (err) {
    console.log("caught:", err.message);
  }

  console.log("\n=== switch strategy at runtime ===");
  const proxy4 = createProxy("apiKey", { key: "old-key" });
  proxy4.request("https://api.example.com/data");
  proxy4.setStrategy("oauth", { accessToken: "oauth-token-xyz", scope: "read" });
  proxy4.request("https://api.example.com/data");

  console.log("\n=== all logs ===");
  console.log(proxy2.getLogs());
}

main();