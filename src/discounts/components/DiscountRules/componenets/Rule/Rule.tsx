import { Multiselect } from "@dashboard/components/Combobox";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { ChannelFragment, RewardValueTypeEnum } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { RuleAccordion } from "./components/RuleAccordion/RuleAccordion";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleInputWrapper } from "./components/RuleInputWrapper/RuleInputWrapper";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  channels: ChannelFragment[];
  index: number;
  disabled?: boolean;
}

export const Rule = ({ channels, index, disabled = false }: RuleProps) => {
  const intl = useIntl();
  const { watch, getValues, setValue } = useFormContext<DiscoutFormData>();

  const ruleNameField = `rules.${index}.name` as const;
  const { trigger } = useFormContext<DiscoutFormData>();
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

  const ruleName = watch(`rules.${index}.name`);
  const selectedChannels = watch(`rules.${index}.channels`);
  const currencySymbol = getCurencySymbol(selectedChannels, channels);

  const richText = useRichText({
    initial: getValues(`rules.${index}.description`),
    loading: false,
    triggerChange: trigger,
  });

  const channelOptions = useMemo(
    () =>
      channels.map<Option>(channel => ({
        label: channel.name,
        value: channel.id,
      })),
    [channels],
  );

  useEffect(() => {
    // Restart reward type to percentage if  no currency
    if (!currencySymbol) {
      setValue(
        `rules.${index}.rewardValueType`,
        RewardValueTypeEnum.PERCENTAGE,
      );
    }
  }, [currencySymbol]);

  return (
    <RichTextContext.Provider value={richText}>
      <RuleAccordion
        title={intl.formatMessage(messages.catalogRule) + `: ${ruleName}`}
        collapsedTitle={intl.formatMessage(messages.catalogRule)}
      >
        <Box display="flex" flexDirection="column" gap={4} marginTop={4}>
          <RuleInputWrapper>
            <Input
              {...nameField}
              disabled={disabled || nameField.disabled}
              size="small"
              label="Name"
            />
          </RuleInputWrapper>

          <RuleDescription disabled={disabled} index={index} />

          <RuleInputWrapper>
            <Multiselect
              {...channelsfield}
              size="small"
              label="Channels"
              options={channelOptions}
              fetchOptions={() => {}}
              disabled={disabled || channelsfield.disabled}
            />
          </RuleInputWrapper>

          {selectedChannels.length > 0 ? (
            <>
              <RuleConditions disabled={disabled} index={index} />
              <RuleReward
                disabled={disabled}
                index={index}
                currencySymbol={currencySymbol}
              />
            </>
          ) : null}
        </Box>
      </RuleAccordion>
    </RichTextContext.Provider>
  );
};
