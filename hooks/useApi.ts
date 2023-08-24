import useCache from "@/store/useCache";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import React from "react";
import { z } from "zod";
interface IAPI {
  url: string;
  key: string;
  method?: "GET" | "POST" | "PATH" | "PUT" | "DELETE";
  body?: object;
}
export default function useApi<T>(
  { url, method = "GET", body = {}, key }: IAPI,
  config?: AxiosRequestConfig
): {
  data: T | null;
  loading: boolean;
  cached: boolean;
  error: Error | null;
} {
  const { override, add, Cache } = useCache((state) => state);
  const [loading, SetLoading] = React.useState<boolean>(true);
  const [error, SetError] = React.useState<Error | null>(null);
  const [cached, SetCached] = React.useState<boolean>(false);
  const controller = new AbortController();

  React.useEffect(() => {
    if (method == "GET") {
      if (Cache[key]) {
        SetLoading(false);
        SetCached(true);
        SetError(null);
        console.log(
          "Data Has Been Loaded From Cache. Fetching New Data in The background"
        );
      }
      axios
        .get(url, {
          signal: controller.signal,
          ...config,
        })
        .then((res) => {
          SetLoading(false);
          SetCached(false);
          SetError(null);
          override(key, res.data);
          if (Array.isArray(res.data)) {
            res.data?.forEach((item: any) => {
              override(`${key}@${item._id}`, item);
            });
          }

          console.log(
            "Data Has Been Fetched in The background. The Cache Has Beend Updated."
          );
        })
        .catch(function (error) {
          SetLoading(false);
          SetError(error);
        });
    }
    if (method == "POST") {
      axios
        .post(url, body, {
          signal: controller.signal,
          ...config,
        })
        .then((res) => {
          SetLoading(false);
          SetError(null);
          add(key, res.data);
        })
        .catch(function (error) {
          SetLoading(false);
          SetError(error);
        });
    }

    return () => {
      return controller.abort();
    };
  }, []);

  return {
    data: Cache[key],
    cached,
    loading,
    error,
  };
}
