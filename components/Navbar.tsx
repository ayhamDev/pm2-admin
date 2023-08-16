import {
  Box,
  Button,
  Card,
  Container,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
} from "@radix-ui/themes";

import React from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import Avatar from "./Avatar";

export default function Navbar() {
  return (
    <Card
      className="bg-[var(--gray-a3)] !rounded-none !fixed !top-0 w-full backdrop-blur-md after:hidden"
      m={"auto"}
    >
      <Container size={"4"}>
        <nav className="px-3 py-2">
          <Flex justify={"between"} align={"center"}>
            <Heading>PM2 ADMIN</Heading>
            <Flex gap={"4"} align={"center"}>
              <Avatar />
            </Flex>
          </Flex>
        </nav>
      </Container>
    </Card>
  );
}
