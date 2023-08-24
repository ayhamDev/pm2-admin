"use client";
import clusterSchema from "@/schema/cluster.schema";
import useCache from "@/store/useCache";
import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  ScrollArea,
} from "@radix-ui/themes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ZodError } from "zod";

export default function ClusterModal() {
  const NameRef = React.useRef<null | HTMLInputElement>(null);
  const IpRef = React.useRef<null | HTMLInputElement>(null);
  const TokenRef = React.useRef<null | HTMLInputElement>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false);
  const [open, setOpen] = useState<boolean>(false);

  const addCache = useCache((state) => state.add);

  const HandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      clusterSchema.parse({
        ServerName: NameRef.current?.value,
        IpAddress: IpRef.current?.value,
        Token: TokenRef.current?.value,
      });
      axios
        .post("/api/cluster", {
          ServerName: NameRef.current?.value,
          IpAddress: IpRef.current?.value,
          Token: TokenRef.current?.value,
        })
        .then((res) => {
          addCache("cluster", res.data);
          setError(null);
          setOpen(false);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      // @ts-ignore
      setError(JSON.parse(err));
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="outline">Add Server</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ overflow: "hidden", padding: 0, margin: 24 }}>
        <form onSubmit={HandleSubmit}>
          <Dialog.Title className="px-6 pt-6">Server Info</Dialog.Title>
          <ScrollArea
            type="auto"
            scrollbars="vertical"
            className="!h-auto px-6"
          >
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  Server Name
                </Text>
                <TextField.Input
                  size={"3"}
                  ref={NameRef}
                  placeholder="My Server..."
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  URL
                </Text>
                <TextField.Input
                  size={"3"}
                  ref={IpRef}
                  placeholder="http://127.0.0.1:3020"
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  Token
                </Text>
                <TextField.Input
                  size={"3"}
                  ref={TokenRef}
                  placeholder="Valid JWT Token From The Server"
                />
              </label>
            </Flex>
          </ScrollArea>
          <div className="px-6 mt-4">
            <Text color="red">
              {error &&
                error.map((err, index) => (
                  <Text
                    key={index}
                    className="w-full block"
                  >{`${err.path}: ${err.message}`}</Text>
                ))}
            </Text>
          </div>
          <Flex gap="3" mt="4" justify="end" className="mt-auto pb-4 px-6">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                disabled={loading ? true : false}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={loading ? true : false}>
              Save
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
