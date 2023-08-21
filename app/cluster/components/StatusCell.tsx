"use client";
import React, { useEffect, useState } from "react";
import { Table } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import useCache from "@/store/useCache";

interface IStatus {
  text: string;
  color: string;
}
const Status: IStatus[] = [
  {
    text: "Checking",
    color: "bg-slate-500",
  },
  {
    text: "Connected",
    color: "bg-green-500",
  },
  {
    text: "Disconnected",
    color: "bg-red-500",
  },
  {
    text: "invalid Token",
    color: "bg-red-800",
  },
  {
    text: "NotFound",
    color: "bg-red-800",
  },
];

interface StatusCell {
  ip: string;
  token: string;
}
export default function StatusCell({ ip, token }: StatusCell) {
  const Cache = useCache((state) => state.Cache);
  const [status, SetStatus] = useState(0);
  const [Pinged, SetPinged] = useState<boolean>(false);
  const [Controllers, SetControllers] = useState<AbortController[]>([]);

  useEffect(() => {
    GetStatus();
    let index = setInterval(() => GetStatus(), 3000);
    return () => {
      clearInterval(index);
      Controllers.forEach((Controller) => {
        Controller.abort();
      });
    };
  }, [ip, token]);
  function GetStatus() {
    const controller = new AbortController();
    axios
      .get(ip, {
        headers: {
          Authorization: token,
        },
        signal: controller.signal,
      })
      .then((res) => {
        if (res.status != 200) return SetStatus(3);
        if (res.data.type != "cluster") return SetStatus(4);
        console.log(true);

        SetStatus(1);
      })
      .catch((err: AxiosError) => {
        console.log(err);
        if (err.response?.status == 401 || err.response?.status == 400) {
          return SetStatus(3);
        }
        if (err.response?.status == 404 || err.response?.status == 500) {
          return SetStatus(4);
        }
        if (err.response?.status == undefined) {
          return SetStatus(2);
        }
      });
    SetControllers((prev) => {
      return [controller, ...prev];
    });
    return controller;
  }
  return (
    <Table.Cell>
      <span
        className={`px-4 py-1 ${Status[status].color} text-white font-extrabold rounded-full`}
      >
        {Status[status].text}
      </span>
    </Table.Cell>
  );
}
