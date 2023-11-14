import { Box, Switch, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { DiscountType } from "../../types";

interface DiscountTypeSwitchProps {
  selected: DiscountType;
  currencySymbol: string;
  onChange: (type: string) => void;
}

const PERCENT_SYMBOL = "%";

export const DiscountTypeSwitch = ({
  selected,
  currencySymbol,
  onChange,
}: DiscountTypeSwitchProps) => {
  return (
    <Switch
      defaultValue={selected}
      onValueChange={onChange}
      height={14}
      paddingY={1.5}
      __width="fit-content"
    >
      <Switch.Item id="fixed" value="fixed" marginLeft={0.5}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={9}
          height="100%"
        >
          <Text>{currencySymbol}</Text>
        </Box>
      </Switch.Item>
      <Switch.Item id="percentage" value="percentage" marginRight={0.5}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={9}
          height="100%"
        >
          <Text>{PERCENT_SYMBOL}</Text>
        </Box>
      </Switch.Item>
    </Switch>
  );
};
