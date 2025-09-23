import { ENV } from "./env";
import { encrypt, decrypt } from "./crypto";

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      if (!v) return fallback;
      if (key.startsWith("secure:")) {
        return JSON.parse(decrypt(v, ENV.ENCRYPTION_KEY)) as T;
      }
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      const data = JSON.stringify(value);
      if (key.startsWith("secure:")) {
        localStorage.setItem(key, encrypt(data, ENV.ENCRYPTION_KEY));
      } else {
        localStorage.setItem(key, data);
      }
    } catch {
      // تجاهل
    }
  }
};