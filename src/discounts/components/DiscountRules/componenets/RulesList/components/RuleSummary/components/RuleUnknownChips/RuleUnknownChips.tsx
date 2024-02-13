import { Chip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const RuleUnknownChips = () => {
  return (
    <Chip
      backgroundColor="accent1Pressed"
      borderColor="accent1"
      color="default1"
    >
      <FormattedMessage defaultMessage="unknown" id="uo8NOT" />
    </Chip>
  );
};
