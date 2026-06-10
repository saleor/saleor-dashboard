import { Box, Text } from "@saleor/macaw-ui-next";
import { TriangleAlert } from "lucide-react";
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
      <TriangleAlert size={16} />
    </Box>
    <Text size={2} color="critical2">
      <FormattedMessage
        {...deprecationBannerMessages.message}
        values={{
          date: <FormattedDate value={upgradeDate} year="numeric" month="long" day="numeric" />,
        }}
      />
    </Text>
  </Box>
);
