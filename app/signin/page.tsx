"use client";
import { Container, Box, Flex, Card, TextField } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";

export default function page() {
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (otp.length == 4) {
      console.log("send");
    }
  }, [otp]);
  return (
    <Flex className="h-[100vh]" justify={"center"} align={"center"}>
      <Container
        className="!px-6 !flex !flex-col !justify-center !items-center"
        size={"1"}
      >
        <Card className="!mt-4 w-fit !m-auto">
          <OtpInput
            shouldAutoFocus={true}
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span className="mx-2">-</span>}
            renderInput={({ className, ...rest }) => (
              <TextField.Input
                disabled={otp.length == 4 ? true : false}
                variant="surface"
                className="!w-[50px] !text-center !p-0"
                {...rest}
              />
            )}
          />
        </Card>
      </Container>
    </Flex>
  );
}
