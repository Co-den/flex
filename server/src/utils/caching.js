// server/src/utils/simpleCache.js
class SimpleCache {
  constructor() {
    this.map = new Map();
  }

  set(key, value, ttlMs = 60_000) {
    const expiresAt = Date.now() + ttlMs;
    if (this.map.has(key)) {
      clearTimeout(this.map.get(key).timeout);
    }
    const timeout = setTimeout(() => this.map.delete(key), ttlMs);
    this.map.set(key, { value, expiresAt, timeout });
  }

  get(key) {
    const item = this.map.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      clearTimeout(item.timeout);
      this.map.delete(key);
      return null;
    }
    return item.value;
  }

  del(key) {
    const item = this.map.get(key);
    if (item) {
      clearTimeout(item.timeout);
      this.map.delete(key);
    }
  }

  clear() {
    for (const [, v] of this.map) clearTimeout(v.timeout);
    this.map.clear();
  }
}

module.exports = new SimpleCache();
