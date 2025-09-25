import { Paragraph } from "@saleor/macaw-ui-next";
import React from "react";

export const ChangingPasswordWarning = () => {
  return (
    <Paragraph
      backgroundColor="warning1"
      padding={4}
      borderWidth={1}
      borderColor={"warning1"}
      borderStyle="solid"
      borderRadius={2}
    >
      WARNING MESSAGE HERE for users who logged in via external methods
    </Paragraph>
  );
};
