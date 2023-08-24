"use client";
import useApi from "@/hooks/useApi";
import clusterSchema from "@/schema/cluster.schema";
import useCache from "@/store/useCache";
import {
  Dialog,
  Button,
  Flex,
  Text,
  ScrollArea,
  Heading,
} from "@radix-ui/themes";
import axios from "axios";
import React, { useState } from "react";
import { z } from "zod";

interface IDeleteClusterModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string | undefined;
}

export default function DeleteClusterModal({
  open,
  setOpen,
  id,
}: IDeleteClusterModal) {
  const DeleteCache = useCache((state) => state.remove);

  const [loading, setLoading] = useState<boolean | null>(false);
  const HandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    axios
      .delete(`/api/cluster/${id}`)
      .then((res) => {
        DeleteCache("cluster", res.data);
        DeleteCache(`cluster@${res.data._id}`, res.data);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const { data } = useApi<z.infer<typeof clusterSchema>>({
    url: `/api/cluster/${id}`,
    key: `cluster@${id}`,
  });
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content style={{ overflow: "hidden", padding: 0, margin: 24 }}>
        <form onSubmit={HandleSubmit}>
          <Dialog.Title className="px-6 pt-6">Delete Server</Dialog.Title>
          <ScrollArea
            type="auto"
            scrollbars="vertical"
            className="!h-auto px-6"
          >
            <Heading as="h2" size={"5"} color="blue">
              Are You Sure That You Want To Delete This Server ?
            </Heading>
            <br />
            <Heading as="h2" size={"5"} color="lime">
              Server Info
            </Heading>
            <Heading as="h3" size={"3"} color="brown">
              Server Name : {data?.ServerName}
            </Heading>
            <Heading as="h3" size={"3"} color="brown">
              URL : {data?.IpAddress}
            </Heading>
            <br />
            <Text color="red">
              Plase Note* That all Processes Will Still Be Running On The
              Server.
            </Text>
          </ScrollArea>

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
            <Button
              color="tomato"
              type="submit"
              disabled={loading ? true : false}
            >
              Delete
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
