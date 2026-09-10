import { shred, shredText } from "@xyne/logger";

export interface StorageLogger {
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
  debug?(message: string, ...meta: unknown[]): void;
}

// Collapse newlines so a value can't forge extra log lines on the console sink
// (log injection). @xyne/logger already strips these; this repeats it locally
// at the sink as an explicit, in-file guard.
const oneLine = (v: unknown): unknown =>
  typeof v === "string" ? v.replace(/[\r\n\u2028\u2029]+/g, " ") : v;

// Default sink: console, with secret values shredded and newlines neutralised
// before anything is written. Hosts can still inject their own (already-safe)
// logger via setStorageLogger.
const shreddingConsole: StorageLogger = {
  info: (message, ...meta) => console.info(oneLine(shredText(message)), ...meta.map((m) => oneLine(shred(m)))),
  warn: (message, ...meta) => console.warn(oneLine(shredText(message)), ...meta.map((m) => oneLine(shred(m)))),
  error: (message, ...meta) => console.error(oneLine(shredText(message)), ...meta.map((m) => oneLine(shred(m)))),
  debug: (message, ...meta) => console.debug(oneLine(shredText(message)), ...meta.map((m) => oneLine(shred(m)))),
};

export let logger: StorageLogger = shreddingConsole;

export function setStorageLogger(custom: StorageLogger): void {
  logger = custom;
}
