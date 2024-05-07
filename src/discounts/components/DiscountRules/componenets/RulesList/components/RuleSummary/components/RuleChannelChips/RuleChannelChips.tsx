import { Rule } from "@dashboard/discounts/models";
import { Chip } from "@saleor/macaw-ui-next";
import React from "react";

interface RuleChannelChipsProps {
  channel: NonNullable<Rule["channel"]>;
}

export const RuleChannelChips = ({ channel }: RuleChannelChipsProps) => {
  return (
    <Chip marginRight={1.5} backgroundColor="accent1Pressed" borderColor="accent1" color="default1">
      {channel.label}
    </Chip>
  );
};
