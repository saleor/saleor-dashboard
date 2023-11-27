import { Multiselect } from "@dashboard/components/Combobox";
import { DiscoutFormData } from "@dashboard/discounts/types";
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
import { RuleInputWrapper } from "./components/RuleInputWrapper/RuleInputWrapper";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  channels: ChannelFragment[];
  index: number;
}

export const Rule = ({ channels, index }: RuleProps) => {
  const { watch } = useFormContext<DiscoutFormData>();

  const ruleNameField = `rules.${index}.name` as const;
  const { field: nameField } = useController<
    DiscoutFormData,
    typeof ruleNameField
  >({
    name: ruleNameField,
  });

  const channelNameField = `rules.${index}.channels` as const;
  const { field: channelsfield } = useController<
    DiscoutFormData,
    typeof channelNameField
  >({
    name: channelNameField,
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
          <RuleInputWrapper>
            <Input {...nameField} size="small" label="Name" />
          </RuleInputWrapper>

          <RuleDescription index={index} />

          <RuleInputWrapper>
            <Multiselect
              size="small"
              label="Channels"
              options={channelOptions}
              fetchOptions={() => {}}
              {...channelsfield}
            />
          </RuleInputWrapper>

          {selectedChannels.length > 0 ? (
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
