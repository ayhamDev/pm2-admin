"use client";
import { Box, ContextMenu, Flex, Heading, Table, Text } from "@radix-ui/themes";
import isMobile from "is-mobile";
import React, { useRef } from "react";
import ClusterModal from "./ClusterModal";
import { useRouter } from "next/navigation";
import { z } from "zod";
import clusterSchema from "@/schema/cluster.schema";
import useApi from "@/hooks/useApi";
import useCache from "@/store/useCache";
import Toast from "@/components/Toast";
import axios from "axios";
import { log } from "console";
import cluster from "cluster";
import StatusCell from "./StatusCell";
import EditClusterModal from "./EditClusterModal";
import DeleteClusterModal from "./DeleteClusterModal";

export default function ClusterTable() {
  const router = useRouter();
  const [ToastOpen, setToastOpen] = React.useState<boolean>(false);

  const [EditModalOpen, SetEditModalOpen] = React.useState<boolean>(false);
  const [EditModalID, SetEditModalID] = React.useState<string | undefined>(
    undefined
  );

  const [DeleteModalOpen, SetDeleteModalOpen] = React.useState<boolean>(false);
  const [DeleteModalID, SetDeleteModalID] = React.useState<string | undefined>(
    undefined
  );

  const { data, error, loading, cached } = useApi<
    z.infer<typeof clusterSchema>[]
  >({
    url: "/api/cluster",
    key: "cluster",
  });

  if (loading) return <Heading>Loading...</Heading>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <Box mb={"6"}>
      <Toast open={ToastOpen} setOpen={setToastOpen} />
      <Flex mb={"4"} justify={"between"} align={"center"}>
        <Heading>Cluster Manager</Heading>
        <ClusterModal />
        {EditModalOpen && (
          <EditClusterModal
            id={EditModalID}
            open={EditModalOpen}
            setOpen={SetEditModalOpen}
          />
        )}
        {DeleteModalOpen && (
          <DeleteClusterModal
            id={DeleteModalID}
            open={DeleteModalOpen}
            setOpen={SetDeleteModalOpen}
          />
        )}
      </Flex>
      <Table.Root
        variant="surface"
        size={isMobile() ? "3" : "3"}
        className="select-none z-0"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Server Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>URL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data?.map((cluster, index) => (
            <ContextMenu.Root key={index}>
              <ContextMenu.Trigger>
                <Table.Row
                  onClick={() => router.push(`/cluster/${cluster.IpAddress}`)}
                >
                  <Table.RowHeaderCell>
                    {cluster.ServerName}
                  </Table.RowHeaderCell>
                  <Table.Cell>{cluster.IpAddress}</Table.Cell>
                  {cached ? (
                    <Table.Cell>
                      <span
                        className={`px-4 py-1 bg-slate-500 text-white font-extrabold rounded-full`}
                      >
                        Checking
                      </span>
                    </Table.Cell>
                  ) : (
                    <StatusCell ip={cluster.IpAddress} token={cluster.Token} />
                  )}
                  {/* <Table.Cell>
              <span className="px-4 py-1 text-white bg-yellow-500 font-extrabold rounded-full">
                Online
              </span>
            </Table.Cell> */}
                </Table.Row>
              </ContextMenu.Trigger>
              <ContextMenu.Content className="min-w-[200px]">
                <ContextMenu.Item
                  onClick={() => {
                    SetEditModalOpen(true);
                    // @ts-ignore
                    SetEditModalID(cluster._id);
                  }}
                >
                  <Flex justify={"start"} align={"center"} gap={"3"}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <Text>Edit</Text>
                  </Flex>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <Flex justify={"start"} align={"center"} gap={"2"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10.358 9.938c1.082-.12 2.202-.12 3.284 0a.464.464 0 0 1 .409.4c.129 1.104.129 2.22 0 3.324a.464.464 0 0 1-.41.4a14.92 14.92 0 0 1-3.283 0a.464.464 0 0 1-.409-.4a14.324 14.324 0 0 1 0-3.324a.464.464 0 0 1 .41-.4Z"
                      />
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M15 2.25a.75.75 0 0 1 .75.75v2.926a2.929 2.929 0 0 1 2.308 2.324H21a.75.75 0 0 1 0 1.5h-2.788c.037.5.061 1 .073 1.5H20a.75.75 0 0 1 0 1.5h-1.715c-.012.5-.036 1-.073 1.5H21a.75.75 0 0 1 0 1.5h-2.942a2.929 2.929 0 0 1-2.308 2.323V21a.75.75 0 0 1-1.5 0v-2.774c-.498.035-.999.059-1.5.07V20a.75.75 0 0 1-1.5 0v-1.704a31.963 31.963 0 0 1-1.5-.07V21a.75.75 0 0 1-1.5 0v-2.927a2.929 2.929 0 0 1-2.308-2.323H3a.75.75 0 0 1 0-1.5h2.788c-.037-.5-.061-1-.074-1.5H4a.75.75 0 0 1 0-1.5h1.714c.013-.5.037-1 .074-1.5H3a.75.75 0 0 1 0-1.5h2.942A2.929 2.929 0 0 1 8.25 5.927V3a.75.75 0 0 1 1.5 0v2.774c.498-.035.999-.059 1.5-.07V4a.75.75 0 0 1 1.5 0v1.704c.501.011 1.002.035 1.5.07V3a.75.75 0 0 1 .75-.75Zm-1.192 6.197a16.407 16.407 0 0 0-3.616 0c-.898.1-1.626.808-1.732 1.717a15.808 15.808 0 0 0 0 3.672c.106.91.834 1.616 1.732 1.717c1.192.133 2.424.133 3.616 0a1.963 1.963 0 0 0 1.732-1.717c.143-1.22.143-2.452 0-3.672a1.963 1.963 0 0 0-1.732-1.717Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    New Process
                  </Flex>
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item
                  onClick={() => {
                    window.open(`/cluster/${cluster.IpAddress}`);
                  }}
                >
                  <Flex justify={"start"} align={"center"} gap={"3"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M12 13a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3.5a.5.5 0 0 0 1 0V3h9v9H8.5a.5.5 0 0 0 0 1H12ZM9 6.5v3a.5.5 0 0 1-1 0V7.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 7H5.5a.5.5 0 0 1 0-1h3a.498.498 0 0 1 .5.497"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Text>Open in New Tab</Text>
                  </Flex>
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={() => {
                    window.open(
                      `/shell/${cluster.IpAddress}`,
                      cluster._id,
                      `height=${window.outerHeight / 1.5},width=${
                        window.outerWidth / 1.5
                      }`
                    );
                  }}
                >
                  <Flex justify={"start"} align={"center"} gap={"3"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M21.83 4c.49 0 .8.4.67.89l-3.16 14.22c-.11.49-.59.89-1.08.89H2.17c-.49 0-.8-.4-.67-.89L4.66 4.89C4.77 4.4 5.25 4 5.74 4h16.09m-6 12h-4c-.46 0-.83.38-.83.84c0 .47.37.85.83.85h4c.47 0 .85-.38.85-.85c0-.46-.38-.84-.85-.84m-10.05.28a.87.87 0 0 0-.21 1.22c.28.42.84.5 1.24.23c7.35-5.17 7.4-5.23 7.45-5.26c.18-.16.27-.38.28-.6c.01-.2-.04-.37-.16-.56L9.46 6.03A.867.867 0 0 0 8.21 6c-.36.32-.38.88-.05 1.24l4.15 4.44l-6.53 4.6Z"
                      />
                    </svg>
                    <Text>Shell</Text>
                  </Flex>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <Flex justify={"start"} align={"center"} gap={"3"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10.59 4.59C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-1.41-1.41z"
                      />
                    </svg>
                    <Text>File Manager</Text>
                  </Flex>
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item
                  color="tomato"
                  onClick={() => {
                    SetDeleteModalID(cluster._id);
                    SetDeleteModalOpen(true);
                  }}
                >
                  <Flex justify={"start"} align={"center"} gap={"3"}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <Text>Delete</Text>
                  </Flex>
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
