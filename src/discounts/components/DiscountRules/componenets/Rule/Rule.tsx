import { Multiselect } from "@dashboard/components/Combobox";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Button, Input, Option } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { getCurencySymbol } from "../../utils";
import { RuleAccordion } from "./components/RuleAccordion/RuleAccordion";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  channels: ChannelFragment[];
  index: number;
  onSubmit?: (index: number) => void;
}

export const Rule = ({ channels, index, onSubmit }: RuleProps) => {
  const intl = useIntl();
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
          {onSubmit && (
            <Box display="flex" justifyContent="flex-end">
              <Button variant="secondary" onClick={() => onSubmit(index)}>
                {intl.formatMessage(buttonMessages.save)}
              </Button>
            </Box>
          )}
        </Box>
      </RuleAccordion>
    </RichTextContext.Provider>
  );
};
