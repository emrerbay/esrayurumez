const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function getKey(ip: string, prefix: string): string {
  return `${prefix}:${ip}`;
}

export function checkRateLimit(ip: string, prefix: string = "comment"): boolean {
  const key = getKey(ip, prefix);
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

// Clean old entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    Array.from(store.entries()).forEach(([k, v]) => {
      if (now > v.resetAt) store.delete(k);
    });
  }, 60000);
}
