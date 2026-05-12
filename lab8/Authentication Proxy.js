const https = require("https");

function createProxy(apiKey) {
  return {
    request(url, options = {}) {

      const headers = {
        ...options.headers,
        "Authorization": `ApiKey ${apiKey}`,
        "Content-Type": "application/json",
      };

      console.log(`[proxy] sending request to ${url}`);
      console.log(`[proxy] headers:`, headers);

      return { url, headers };
    }
  };
}

function main() {
  const proxy = createProxy("my-secret-key-123");

  const result = proxy.request("https://api.example.com/data");
  console.log("\nrequest ready:", result);

  const result2 = proxy.request("https://api.example.com/users", {
    headers: { "X-Custom": "value" }
  });
  console.log("\nrequest with extra headers:", result2);
}

main();