/**
 * E2E test: triggers a real bug and sends it to Coddie via the SDK.
 * Run with: npx tsx test-coddie.ts
 */
import { CoddieClient } from "@coddiedev/sdk";
import { formatUserSummary } from "./src/utils/format-user.js";

const coddie = new CoddieClient({
  projectKey: "79c3efde2e38e0f8314d6718b64da30abe37ac66679af7826a273c2e9251eb5e",
  endpoint: "https://coddieapp.vercel.app/api/ingest",
  environment: "production",
  runtime: "node",
});

// This will throw: TypeError: Cannot read properties of undefined (reading 'preferences')
// because metadata is optional and not provided
try {
  const summary = formatUserSummary({
    name: "Alice",
    email: "alice@example.com",
    roles: ["admin", "editor"],
    // metadata intentionally omitted to trigger the bug
  });
  console.log("Summary:", summary);
} catch (error) {
  if (error instanceof Error) {
    console.error("Caught error:", error.message);
    console.error("Stack:", error.stack);
    console.log("\nSending to Coddie...");

    coddie.captureError(error, {
      function: "formatUserSummary",
      file: "src/utils/format-user.ts",
    });

    // Wait for the fire-and-forget fetch to complete before exiting
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Done! Check your GitHub repo for a PR from Coddie.");
  }
}
