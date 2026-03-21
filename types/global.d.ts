type GTagCommand =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?];

declare global {
  interface Window {
    gtag: (...args: GTagCommand) => void;
  }
}

export {};
