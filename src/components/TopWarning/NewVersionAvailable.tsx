import { Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Container } from "./Container";

export const NewVersionAvailable = () => {
  const { updateServiceWorker } = useRegisterSW();

  const handleReloadClick = () => {
    updateServiceWorker()
  };

  return (
    <Container>
      <Text size={1} fontWeight="medium">
        <FormattedMessage
          id="sngdVO"
          defaultMessage="New dashboard version available."
          description="New dashboard version available."
        />
      </Text>
      <Button
        onClick={handleReloadClick}
        size="small"
        variant="tertiary"
        color="accent1"
        textDecoration="underline"
        __paddingRight="3px"
        __paddingLeft="3px"
      >
        <FormattedMessage
          id="t1Qs2z"
          defaultMessage="Click here to reload."
          description="Click here to reload."
        />
      </Button>
    </Container>
  );
};
