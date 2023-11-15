import { Multiselect } from "@dashboard/components/Combobox";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import React from "react";

import { DiscountRule } from "../../types";
import { RuleAccordion } from "./components/RuleAccordion/RuleAccordion";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  rule: DiscountRule;
  channels: Option[];
}

export const Rule = ({ channels }: RuleProps) => {
  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: () => {},
  });

  return (
    <RichTextContext.Provider value={richText}>
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

          <RuleConditions />

          <RuleReward />

          <RuleDescription />
        </Box>
      </RuleAccordion>
    </RichTextContext.Provider>
  );
};
