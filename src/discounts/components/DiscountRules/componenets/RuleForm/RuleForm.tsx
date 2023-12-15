import { Condition, Rule as RuleType } from "@dashboard/discounts/models";
import { ChannelFragment, RewardValueTypeEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import {
  CommonError,
  getCommonFormFieldErrorMessage,
} from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Input, Option, Select } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { ConditionType } from "../../../../types";
import { getCurencySymbol } from "../../utils";
import { FetchOptions } from "./components/RuleConditionRow";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleInputWrapper } from "./components/RuleInputWrapper/RuleInputWrapper";
import { RuleReward } from "./components/RuleReward";

interface RuleFormProps<ErrorCode> {
  channels: ChannelFragment[];
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode>>;
  typeToFetchMap: Record<ConditionType, FetchOptions>;
}

export const RuleForm = <ErrorCode,>({
  channels,
  disabled = false,
  errors,
  typeToFetchMap,
}: RuleFormProps<ErrorCode>) => {
  const intl = useIntl();
  const { watch, getValues, setValue, formState } = useFormContext<RuleType>();
  const formErrors = getFormErrors(["rewardValue"], errors);

  const { trigger } = useFormContext<RuleType>();
  const { field: nameField } = useController<RuleType, "name">({
    name: "name",
  });

  const { field: channelfield } = useController<RuleType, "channel">({
    name: "channel",
  });

  const selectedChannel = watch("channel");
  const hasSelectedChannel = !!selectedChannel;
  const currencySymbol = getCurencySymbol(selectedChannel, channels);

  const richText = useRichText({
    initial: getValues("description"),
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
      setValue("rewardValueType", RewardValueTypeEnum.PERCENTAGE);
    }
  }, [currencySymbol]);

  return (
    <RichTextContext.Provider value={richText}>
      <Box display="flex" flexDirection="column" gap={4} marginTop={4}>
        <Box display="flex" gap={4}>
          <RuleInputWrapper __flex={1}>
            <Input
              {...nameField}
              disabled={disabled || nameField.disabled}
              size="small"
              label="Name"
              error={!!formState.errors?.name?.message}
              helperText={formState.errors?.name?.message}
            />
          </RuleInputWrapper>

          <RuleInputWrapper __flex={1}>
            <Select
              {...channelfield}
              onChange={selectedChannel => {
                channelfield.onChange(selectedChannel);
                setValue("conditions", [Condition.empty()]);
              }}
              size="small"
              data-test-id="channel-dropdown"
              label={intl.formatMessage(commonMessages.channel)}
              options={channelOptions}
              disabled={disabled || channelfield.disabled}
            />
          </RuleInputWrapper>
        </Box>

        <RuleConditions
          disabled={disabled}
          hasSelectedChannels={hasSelectedChannel}
          typeToFetchMap={typeToFetchMap}
        />

        <RuleReward
          disabled={disabled}
          currencySymbol={currencySymbol}
          error={getCommonFormFieldErrorMessage(formErrors.rewardValue, intl)}
        />

        <RuleDescription disabled={disabled} />

        <button type="submit" hidden>
          Submit
        </button>
      </Box>
    </RichTextContext.Provider>
  );
};
