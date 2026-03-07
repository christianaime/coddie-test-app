/**
 * E2E test: triggers a real bug and sends it to Coddie via the SDK.
 * Run with: npx tsx test-coddie.ts
 */
import { CoddieClient } from "@coddiedev/sdk";
import { parseConfig } from "./src/utils/parse-config.js";

const coddie = new CoddieClient({
  projectKey: "79c3efde2e38e0f8314d6718b64da30abe37ac66679af7826a273c2e9251eb5e",
  endpoint: "https://coddieapp.vercel.app/api/ingest",
  environment: "production",
  runtime: "node",
});

// This will throw: TypeError: Cannot read properties of undefined (reading 'split')
// because allowedOrigins is missing from the config object
try {
  const config = parseConfig({
    port: 8080,
    host: "0.0.0.0",
    debug: true,
    // allowedOrigins intentionally omitted to trigger the bug
  });
  console.log("Config:", config);
} catch (error) {
  if (error instanceof Error) {
    console.error("Caught error:", error.message);
    console.error("Stack:", error.stack);
    console.log("\nSending to Coddie...");

    coddie.captureError(error, {
      input: { port: 8080, host: "0.0.0.0", debug: true },
      function: "parseConfig",
      file: "src/utils/parse-config.ts",
    });

    // Wait for the fire-and-forget fetch to complete before exiting
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Done! Check your GitHub repo for a PR from Coddie.");
  }
}
