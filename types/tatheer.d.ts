declare global {
  interface Window {
    tatheer?: (name: string, params?: Record<string, unknown>) => void;
  }
}

export {};
