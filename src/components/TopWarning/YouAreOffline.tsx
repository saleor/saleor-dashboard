import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Container } from "./Container";

export const YouAreOffline = () => {
  return (
    <Container>
      <Text size={1} fontWeight="medium">
        <FormattedMessage
          id="cLnkZn"
          defaultMessage="You are currently offline. Some features may not be available."
          description="You are currently offline. Some features may not be available."
        />
      </Text>
    </Container>
  );
};
