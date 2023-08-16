import { Box, Heading, Container } from "@radix-ui/themes";
import React from "react";

export default function Wrapper() {
  return (
    <Box className="bg-[var(--gray-a3)]">
      <Container>
        <nav className="py-4 px-6">
          <Heading>PM2 ADMIN</Heading>
        </nav>
      </Container>
    </Box>
  );
}
