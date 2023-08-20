import clusterSchema from "@/schema/cluster.schema";
import useCache from "@/store/useCache";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import React from "react";
import { z } from "zod";
interface IAPI {
  url: string;
  key: "cluster";
  method?: "GET" | "POST" | "PATH" | "PUT" | "DELETE";
  body?: object;
}
export default function useApi<T>(
  { url, method = "GET", body = {}, key }: IAPI,
  config?: AxiosRequestConfig
): {
  data: T | null;
  SetData: React.SetStateAction<React.Dispatch<T | null>>;
  loading: boolean;
  error: Error | null;
} {
  const { override, Cache } = useCache((state) => state);
  const [loading, SetLoading] = React.useState<boolean>(true);
  const [error, SetError] = React.useState<Error | null>(null);
  const controller = new AbortController();

  React.useEffect(() => {
    window.addEventListener("online", () => {});
    if (method == "GET") {
      if (Cache[key]) {
        SetLoading(false);
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
          SetError(null);
          override("cluster", res.data);
          console.log(
            "Data Has Been Fetched in The background. The Cache Has Beend Updated."
          );
        })
        .catch(function (error) {
          if (error.response) {
            SetLoading(false);
            SetError(error);
          } else if (error.request) {
            SetLoading(false);
            SetError(error);
          } else {
            SetLoading(false);
            SetError(error);
          }
        });
    }

    return () => {
      return controller.abort();
    };
  }, []);

  return {
    data: Cache[key],
    loading,
    error,
  };
}
