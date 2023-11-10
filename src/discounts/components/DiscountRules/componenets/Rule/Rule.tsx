import { Multiselect } from "@dashboard/components/Combobox";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import React from "react";

import { DiscountRule } from "../../types";
import { DiscountConditions } from "../DiscountConditions";
import { RuleAccordion } from "./RuleAccordion";

interface RuleProps {
  rule: DiscountRule;
  channels: Option[];
}

export const Rule = ({ channels }: RuleProps) => {
  return (
    <RuleAccordion title="Catalog rule">
      <Box display="flex" flexDirection="column" gap={4} marginTop={4}>
        <Input name="name" label="Name" size="small" />

        <Multiselect
          size="small"
          label="Channels"
          options={channels}
          value={[]}
          onChange={() => {}}
          fetchOptions={() => {}}
        />

        <DiscountConditions />
      </Box>
    </RuleAccordion>
  );
};
