import { Alarm } from "@material-ui/icons";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedDate, FormattedMessage } from "react-intl";

import { deprecationBannerMessages } from "./messages";

interface DeprecationBannerContentProps {
  upgradeDate: Date;
}

export const DeprecationBannerContent = ({ upgradeDate }: DeprecationBannerContentProps) => (
  <Box
    display="flex"
    gap={2}
    paddingX={4}
    paddingY={3}
    backgroundColor="critical1"
    alignItems="flex-start"
    data-test-id="deprecation-banner"
  >
    <Box display="flex" alignItems="center" color="critical2" __paddingTop="2px">
      <Alarm fontSize="medium" />
    </Box>
    <Box display="flex" flexDirection="column" gap={1}>
      <Text size={2} fontWeight="bold" color="critical2">
        <FormattedMessage {...deprecationBannerMessages.title} />
      </Text>
      <Text size={2} color="critical2">
        <FormattedMessage
          {...deprecationBannerMessages.message}
          values={{
            date: <FormattedDate value={upgradeDate} year="numeric" month="long" day="numeric" />,
          }}
        />
      </Text>
    </Box>
  </Box>
);
