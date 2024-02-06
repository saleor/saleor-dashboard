import { createEmptyCodition, Rule } from "@dashboard/discounts/models";
import { PromotionTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
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

import { useDiscountRulesContext } from "../../context";
import { getCurencySymbol } from "../../utils";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleInputWrapper } from "./components/RuleInputWrapper/RuleInputWrapper";
import { RuleReward } from "./components/RuleReward";

interface RuleFormProps<ErrorCode> {
  errors: Array<CommonError<ErrorCode>>;
}

export const RuleForm = <ErrorCode,>({ errors }: RuleFormProps<ErrorCode>) => {
  const intl = useIntl();
  const { disabled, channels, discountType } = useDiscountRulesContext();
  const { watch, getValues, setValue, formState } = useFormContext<Rule>();
  const formErrors = getFormErrors(["rewardValue"], errors);

  const { trigger } = useFormContext<Rule>();
  const { field: nameField } = useController<Rule, "name">({
    name: "name",
  });

  const { field: channelfield } = useController<Rule, "channel">({
    name: "channel",
  });

  const selectedChannel = watch("channel");

  const conditions = watch("conditions");
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

  const handleChannelChange = (selectedChannel: Option) => {
    setValue("channel", selectedChannel, { shouldValidate: true });
    setValue("rewardGifts", []);

    // Restart conditions when catalog promotion
    if (discountType === PromotionTypeEnum.CATALOGUE) {
      if (conditions.length > 0) {
        setValue("conditions", [createEmptyCodition()]);
      }
    }
  };

  return (
    <RichTextContext.Provider value={richText}>
      <Box __width={650} __minHeight={515} __maxHeight="75vh" overflowY="auto">
        <Box display="flex" flexDirection="column" gap={4} marginTop={4}>
          <Box display="flex" gap={4}>
            <RuleInputWrapper __flex={1}>
              <Input
                {...nameField}
                disabled={disabled || nameField.disabled}
                size="small"
                label={intl.formatMessage(commonMessages.name)}
                error={!!formState.errors?.name?.message}
                helperText={formState.errors?.name?.message}
              />
            </RuleInputWrapper>

            <RuleInputWrapper __flex={1}>
              <Select
                {...channelfield}
                onChange={handleChannelChange}
                size="small"
                data-test-id="channel-dropdown"
                label={intl.formatMessage(commonMessages.channel)}
                options={channelOptions}
                error={!!formState.errors?.channel?.message}
                helperText={formState.errors?.channel?.message}
                disabled={disabled || channelfield.disabled}
              />
            </RuleInputWrapper>
          </Box>

          <RuleConditions hasSelectedChannels={hasSelectedChannel} />

          <RuleReward
            currencySymbol={currencySymbol}
            error={getCommonFormFieldErrorMessage(formErrors.rewardValue, intl)}
          />

          <RuleDescription />

          <button type="submit" hidden>
            Submit
          </button>
        </Box>
      </Box>
    </RichTextContext.Provider>
  );
};
