"use client";
import { create } from "zustand";

interface Cache {
  [key: string]: any[];
}

interface ICacheStore {
  Cache: Cache;
  override: (key: string, data: any) => void;
  add: (key: string, data: any) => void;
  update: (key: string, data: any) => void;
  remove: (key: string) => void;
}
const Storage = {
  load(): Cache {
    if (typeof window === "undefined") return {};
    return Object.keys(JSON.parse(localStorage.getItem("cache") || "{}"))
      .length == 0
      ? {}
      : { ...JSON.parse(localStorage.getItem("cache") || "{}") };
  },
  add(key: string, data: any, options?: { override: false }): Cache | null {
    if (typeof window === "undefined") return null;
    const Cache = this.load();
    if (!Cache[key]) {
      Cache[key] = [];
    }
    if (!options?.override) {
      Cache[key].push(data);
    } else {
      Cache[key] = data;
    }
    localStorage.setItem("cache", JSON.stringify(Cache));
    return Cache;
  },
};

const useCache = create<ICacheStore>((set) => ({
  Cache: Storage.load(),
  add: (key: string, data: []) =>
    set((state) => {
      state.Cache[key];
      if (!state.Cache[key]) {
        state.Cache[key] = [];
      }
      state.Cache[key].push(data);
      Storage.add(key, data);
      return { Cache: state.Cache };
    }),
  override: (key: string, data: []) =>
    set((state) => {
      state.Cache[key] = data;
      Storage.add(key, data, { override: true });
      return { Cache: state.Cache };
    }),
  update: (key: string, data: any) => {},
  remove: (key: string) => {},
}));
export default useCache;
