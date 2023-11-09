import { Box, Switch, Text } from "@saleor/macaw-ui-next";
import React from "react";

type DiscountType = "fixed" | "percentage";
interface DiscountTypeSwitchProps {
  selected: DiscountType;
  onChange: (type: string) => void;
}

export const DiscountTypeSwitch = ({
  selected,
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
          <Text>zl</Text>
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
          <Text>%</Text>
        </Box>
      </Switch.Item>
    </Switch>
  );
};
