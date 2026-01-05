"use client";

import { syncTryCatch } from "lpm/utils/synctrycatch";

export default function useLocalStg() {
  const removeItem = (name: string) => {
    syncTryCatch(() => {
      window.localStorage.removeItem(name);
    });
  };

  const getItem = <T>(name: string, fallback?: T) => {
    const [data] = syncTryCatch<T>(() => {
      const saved = window.localStorage.getItem(name);

      if (!saved) return fallback;
      return JSON.parse(saved);
    });

    return data ?? fallback;
  };

  const saveItem = (name: string, data: unknown) => {
    syncTryCatch(() => {
      window.localStorage.setItem(name, JSON.stringify(data));
    });
  };

  return {
    getItem,
    removeItem,
    saveItem,
  };
}
