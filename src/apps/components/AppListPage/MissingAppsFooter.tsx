import { MISSING_APPS_TYPEFORM_URL } from "@dashboard/links";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

const CONST_TYPEFORM_URL = `${MISSING_APPS_TYPEFORM_URL}?utm_button=${encodeURIComponent("Request integration")}`;

export const MissingAppsFooter = () => {
  const intl = useIntl();

  return (
    <Box>
      <Box
        height="100%"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexDirection="column"
        marginTop={20}
        marginBottom={52}
      >
        <Text marginTop={5} as="h1" fontSize={11} fontWeight="regular" marginBottom={7}>
          {intl.formatMessage(messages.missingAppsHeader)}
        </Text>
        <Text size={5} marginBottom={7}>
          {intl.formatMessage(messages.missingAppsDescription)}
        </Text>
        <Button target="_blank" as="a" size="large" paddingX={10} href={CONST_TYPEFORM_URL}>
          {intl.formatMessage(messages.missingAppsButton)}
        </Button>
      </Box>
    </Box>
  );
};
