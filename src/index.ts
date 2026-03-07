import { parseConfig } from "./utils/parse-config.js";

const config = parseConfig({
  port: 8080,
  host: "0.0.0.0",
  debug: true,
  // NOTE: allowedOrigins is missing — this triggers the bug
});

console.log("Server config:", config);
