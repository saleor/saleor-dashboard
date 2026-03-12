import { type PersistentStorage } from "apollo3-cache-persist";

const DEFAULT_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

export class TTLLocalStorageWrapper implements PersistentStorage<string | null> {
  private timestampKey: string;

  constructor(
    private storage: Storage,
    cacheKey: string,
    private maxAge: number = DEFAULT_MAX_AGE_MS,
  ) {
    this.timestampKey = `${cacheKey}-timestamp`;
  }

  getItem(key: string): string | null {
    const timestamp = this.storage.getItem(this.timestampKey);

    if (timestamp) {
      const age = Date.now() - Number(timestamp);

      if (age > this.maxAge) {
        this.storage.removeItem(key);
        this.storage.removeItem(this.timestampKey);

        return null;
      }
    }

    return this.storage.getItem(key);
  }

  setItem(key: string, value: string | null): void {
    if (value !== null) {
      this.storage.setItem(key, value);
      this.storage.setItem(this.timestampKey, String(Date.now()));
    } else {
      this.removeItem(key);
    }
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
    this.storage.removeItem(this.timestampKey);
  }
}
