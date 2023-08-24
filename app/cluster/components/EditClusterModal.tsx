"use client";
import useApi from "@/hooks/useApi";
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
import { z } from "zod";

interface IEditClusterModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string | undefined;
}

export default function EditClusterModal({
  open,
  setOpen,
  id,
}: IEditClusterModal) {
  const UpdateCache = useCache((state) => state.update);
  const NameRef = React.useRef<null | HTMLInputElement>(null);
  const IpRef = React.useRef<null | HTMLInputElement>(null);
  const TokenRef = React.useRef<null | HTMLInputElement>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false);
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
        .put(`/api/cluster/${id}`, {
          ServerName: NameRef.current?.value,
          IpAddress: IpRef.current?.value,
          Token: TokenRef.current?.value,
        })
        .then((res) => {
          UpdateCache("cluster", res.data);
          UpdateCache(`cluster@${res.data._id}`, res.data);

          setError(null);
          setOpen(false);
        })
        .catch((err) => {
          console.log(err);

          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);

      setError(JSON.parse(err));
    }
  };
  const { data } = useApi<z.infer<typeof clusterSchema>>({
    url: `/api/cluster/${id}`,
    key: `cluster@${id}`,
  });
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content style={{ overflow: "hidden", padding: 0, margin: 24 }}>
        <form onSubmit={HandleSubmit}>
          <Dialog.Title className="px-6 pt-6">Edit Server Info</Dialog.Title>
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
                  defaultValue={data?.ServerName}
                  ref={NameRef}
                  placeholder="My Server..."
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  URL
                </Text>
                <TextField.Input
                  ref={IpRef}
                  defaultValue={data?.IpAddress}
                  placeholder="http://127.0.0.1:3020"
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  Token
                </Text>
                <TextField.Input
                  ref={TokenRef}
                  defaultValue={data?.Token}
                  placeholder="Valid JWT Token From The Server"
                />
              </label>
            </Flex>
          </ScrollArea>
          <div className="px-6 mt-4">
            <Text color="red">
              {error &&
                error?.map((err, index) => (
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
