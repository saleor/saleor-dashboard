import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export const FlatTaxRateLabel: React.FC = () => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" __height="40px">
      <Text>
        {intl.formatMessage({
          defaultMessage: "Use flat tax rate",
          id: "zSDfq0",
        })}
      </Text>
    </Box>
  );
};
