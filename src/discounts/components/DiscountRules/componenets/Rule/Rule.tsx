import { Multiselect } from "@dashboard/components/Combobox";
import { CreateDiscoutFormData } from "@dashboard/discounts/components/DiscountCreatePage/types";
import { ChannelFragment } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";

import { getCurencySymbol } from "../../utils";
import { RuleAccordion } from "./components/RuleAccordion/RuleAccordion";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  channels: ChannelFragment[];
  index: number;
}

export const Rule = ({ channels, index }: RuleProps) => {
  const { control, watch } = useFormContext<CreateDiscoutFormData>();
  const { field: nameField } = useController<
    CreateDiscoutFormData,
    `rules.${number}.name`
  >({
    name: `rules.${index}.name`,
    control,
  });
  const { field: channelsfield } = useController<
    CreateDiscoutFormData,
    `rules.${number}.channels`
  >({
    name: `rules.${index}.channels`,
    control,
  });

  const selectedChannels = watch(`rules.${index}.channels`);
  const currencySymbol = getCurencySymbol(selectedChannels, channels);

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: () => {},
  });

  const channelOptions = useMemo(
    () =>
      channels.map<Option>(channel => ({
        label: channel.name,
        value: channel.id,
      })),
    [channels],
  );

  return (
    <RichTextContext.Provider value={richText}>
      <RuleAccordion title="Catalog rule">
        <Box display="flex" flexDirection="column" gap={4} marginTop={4}>
          <Input {...nameField} size="small" label="Name" />

          <RuleDescription index={index} />

          <Multiselect
            size="small"
            label="Channels"
            options={channelOptions}
            fetchOptions={() => {}}
            {...channelsfield}
          />

          {currencySymbol ? (
            <>
              <RuleConditions index={index} />

              <RuleReward index={index} currencySymbol={currencySymbol} />
            </>
          ) : null}
        </Box>
      </RuleAccordion>
    </RichTextContext.Provider>
  );
};
