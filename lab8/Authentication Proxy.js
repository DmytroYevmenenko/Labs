const https = require("https");

const strategies = {
  apiKey(credentials) {
    return { "Authorization": `ApiKey ${credentials.key}` };
  },

  jwt(credentials) {
    return { "Authorization": `Bearer ${credentials.token}` };
  },

  oauth(credentials) {
    return {
      "Authorization": `Bearer ${credentials.accessToken}`,
      "X-OAuth-Scope": credentials.scope || "read"
    };
  }
};


function createProxy(apiKey) {
  return {
    strategy,
    credentials,

    request(url, options = {}) {
      if (!strategies[strategy]) {
        throw new Error(`unknown strategy: ${strategy}`);
      }

      const authHeaders = strategies[strategy](credentials);

      const headers = {
        ...options.headers,
        ...authHeaders,
        "Content-Type": "application/json",
      };

      console.log(`[proxy] ${strategy} | ${url}`);
      console.log(`[proxy] injected:`, authHeaders);

      return { url, headers, method: options.method || "GET" };
    },

    setStrategy(newStrategy, newCredentials) {
      this.strategy = newStrategy;
      this.credentials = newCredentials;
      console.log(`[proxy] switched to ${newStrategy}`);
    }
  };
}

function main() {
  console.log("=== api key ===");
  const proxy1 = createProxy("apiKey", { key: "secret-123" });
  proxy1.request("https://api.example.com/data");

  console.log("\n=== jwt (with bug - no expiry check) ===");
  const proxy2 = createProxy("jwt", {
    token: "eyJ.expired.token",
    expiresAt: Date.now() - 10000
  });
  proxy2.request("https://api.example.com/profile");

  console.log("\n=== oauth ===");
  const proxy3 = createProxy("oauth", {
    accessToken: "oauth-token-xyz",
    scope: "read write"
  });
  proxy3.request("https://api.example.com/posts");

  console.log("\n=== switch strategy ===");
  proxy1.setStrategy("jwt", { token: "new-token-abc" });
  proxy1.request("https://api.example.com/data");
}

main();