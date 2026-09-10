import { shred, shredText } from "@xyne/logger";

export interface StorageLogger {
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
  debug?(message: string, ...meta: unknown[]): void;
}

// Default sink: console, but with secret values shredded out of the message and
// every meta arg first. Hosts can still inject their own (already-shredding)
// logger via setStorageLogger.
const shreddingConsole: StorageLogger = {
  info: (message, ...meta) => console.info(shredText(message), ...meta.map((m) => shred(m))),
  warn: (message, ...meta) => console.warn(shredText(message), ...meta.map((m) => shred(m))),
  error: (message, ...meta) => console.error(shredText(message), ...meta.map((m) => shred(m))),
  debug: (message, ...meta) => console.debug(shredText(message), ...meta.map((m) => shred(m))),
};

export let logger: StorageLogger = shreddingConsole;

export function setStorageLogger(custom: StorageLogger): void {
  logger = custom;
}
