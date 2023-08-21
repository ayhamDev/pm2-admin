"use client";
import { json } from "node:stream/consumers";
import { create } from "zustand";

interface Cache {
  [key: string]: any[];
}

interface ICacheStore {
  Cache: Cache;
  override: (key: string, data: any) => void;
  add: (key: string, data: any) => void;
  update: (key: string, data: any) => void;
  remove: (key: string, data: any) => void;
}
const Storage = {
  load(): Cache {
    if (typeof window === "undefined") return {};
    return Object.keys(JSON.parse(localStorage.getItem("cache") || "{}"))
      .length == 0
      ? {}
      : { ...JSON.parse(localStorage.getItem("cache") || "{}") };
  },
  add(key: string, data: any, options?: { override: boolean }): Cache | null {
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
  update(key: string, data: any): Cache | null {
    if (typeof window === "undefined") return null;
    const Cache = this.load();
    if (Array.isArray(Cache[key])) {
      if (Cache[key].find((val) => val._id == data._id)) {
        const index = Cache[key].findIndex((val) => val._id == data._id);
        Cache[key][index] = data;
      }
    } else {
      Cache[key] = data;
    }

    localStorage.setItem("cache", JSON.stringify(Cache));
    return Cache;
  },
  remove(key: string, data: any): Cache | null {
    const Cache = this.load();
    if (Array.isArray(Cache[key])) {
      Cache[key] = Cache[key].filter((val) => val._id != data._id);
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
  update: (key: string, data: any) =>
    set((state) => {
      if (Array.isArray(state.Cache[key])) {
        if (state.Cache[key].find((val) => val._id == data._id)) {
          const index = state.Cache[key].findIndex(
            (val) => val._id == data._id
          );
          state.Cache[key][index] = data;
        }
      } else {
        state.Cache[key] = data;
      }
      Storage.update(key, data);

      return { Cache: state.Cache };
    }),
  remove: (key: string, data: any) =>
    set((state) => {
      if (Array.isArray(state.Cache[key])) {
        state.Cache[key] = state.Cache[key].filter(
          (val) => val._id != data._id
        );
      } else {
        state.Cache[key] = data;
      }
      Storage.remove(key, data);
      return { Cache: state.Cache };
    }),
}));
export default useCache;
