import { Multiselect } from "@dashboard/components/Combobox";
import { Inputs } from "@dashboard/discounts/components/DiscountCreatePage/types";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { RuleAccordion } from "./components/RuleAccordion/RuleAccordion";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  channels: Option[];
  id: string;
  index: number;
}

export const Rule = ({ channels, index }: RuleProps) => {
  const { control } = useFormContext<Inputs>();
  const { field: nameField } = useController<Inputs, `rules.${number}.name`>({
    name: `rules.${index}.name`,
    control,
  });
  const { field: channelsfield } = useController<
    Inputs,
    `rules.${number}.channels`
  >({
    name: `rules.${index}.channels`,
    control,
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: () => {},
  });

  return (
    <RichTextContext.Provider value={richText}>
      <RuleAccordion title="Catalog rule">
        <Box display="flex" flexDirection="column" gap={4} marginTop={4}>
          <Input {...nameField} size="small" label="Name" />

          <Multiselect
            size="small"
            label="Channels"
            options={channels}
            fetchOptions={() => {}}
            {...channelsfield}
          />

          <RuleConditions />

          <RuleReward index={index} />

          <RuleDescription index={index} />
        </Box>
      </RuleAccordion>
    </RichTextContext.Provider>
  );
};
