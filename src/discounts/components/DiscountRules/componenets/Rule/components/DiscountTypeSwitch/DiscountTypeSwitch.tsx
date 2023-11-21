import { RewardValueTypeEnum } from "@dashboard/graphql";
import { Box, Switch, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface DiscountTypeSwitchProps {
  selected: RewardValueTypeEnum;
  currencySymbol: string | null;
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
      padding={1.5}
      __width="fit-content"
    >
      {currencySymbol && (
        <Switch.Item
          id="fixed"
          value={RewardValueTypeEnum.FIXED}
          marginLeft={0.5}
        >
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
      )}
      <Switch.Item
        id="percentage"
        value={RewardValueTypeEnum.PERCENTAGE}
        marginRight={0.5}
      >
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
