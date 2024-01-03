import { RewardValueTypeEnum } from "@dashboard/graphql";
import { Box, Switch, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface DiscountTypeSwitchProps {
  disabled?: boolean;
  selected: RewardValueTypeEnum;
  currencySymbol: string | null;
  onChange: (type: string) => void;
}

const PERCENT_SYMBOL = "%";

export const DiscountTypeSwitch = ({
  selected,
  currencySymbol,
  disabled,
  onChange,
}: DiscountTypeSwitchProps) => {
  return (
    <Switch
      disabled={disabled}
      value={selected}
      onValueChange={onChange}
      __height="52px"
      __width="fit-content"
      padding={1.5}
    >
      {currencySymbol && (
        <Switch.Item
          id="fixed"
          disabled={disabled}
          value={RewardValueTypeEnum.FIXED}
          name="fixed"
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
        disabled={disabled}
        name="percentage"
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
