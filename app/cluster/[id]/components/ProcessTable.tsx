import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import React from "react";

export default function ProcessTable() {
  return (
    <Box>
      <Flex mb={"4"} justify={"between"} align={"center"}>
        <Heading>Process Manager</Heading>
        <Button variant="ghost">New Process</Button>
      </Flex>
    </Box>
  );
}
