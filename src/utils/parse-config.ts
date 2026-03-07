export interface AppConfig {
  port: number;
  host: string;
  debug: boolean;
  allowedOrigins: string[];
}

/**
 * Parses a raw config object into a validated AppConfig.
 * BUG: does not handle the case where `raw` is null/undefined,
 * causing a TypeError when accessing properties.
 */
export function parseConfig(raw: Record<string, unknown>): AppConfig {
  const port = Number(raw.port) || 3000;
  const host = (raw.host as string) ?? "localhost";
  const debug = Boolean(raw.debug);

  // BUG: raw.allowedOrigins could be undefined, and calling .split on undefined throws
  const originsStr = raw.allowedOrigins as string;
  const allowedOrigins = originsStr ? originsStr.split(",").map((s) => s.trim()) : [];

  return { port, host, debug, allowedOrigins };
}