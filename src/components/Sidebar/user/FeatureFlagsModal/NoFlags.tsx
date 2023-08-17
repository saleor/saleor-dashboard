import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const NoFlags = () => (
  <Box
    width="100%"
    display="flex"
    justifyContent="center"
    borderWidth={1}
    borderStyle="solid"
    borderTopWidth={1}
    borderColor="neutralHighlight"
    paddingTop={52}
  >
    <Text color="textNeutralDisabled" size="large">
      <FormattedMessage
        id="pEf/m+"
        defaultMessage="There are no previews at the moment. Stay tuned!"
      />
    </Text>
  </Box>
);
