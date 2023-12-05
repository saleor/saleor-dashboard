import { Multiselect } from "@dashboard/components/Combobox";
import {
  ChannelFragment,
  PromotionCreateErrorFragment,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import {
  CommonError,
  getCommonFormFieldErrorMessage,
} from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { ConditionType, Rule as RuleType } from "../../../../types";
import { getCurencySymbol } from "../../utils";
import { FetchOptions } from "./components/RuleConditionRow";
import { RuleConditions } from "./components/RuleConditions";
import { RuleDescription } from "./components/RuleDescription";
import { RuleInputWrapper } from "./components/RuleInputWrapper/RuleInputWrapper";
import { RuleReward } from "./components/RuleReward";

interface RuleProps {
  channels: ChannelFragment[];
  disabled?: boolean;
  errors: Array<CommonError<PromotionCreateErrorFragment["code"]>>;
  typeToFetchMap: Record<ConditionType, FetchOptions>;
}

export const Rule = ({
  channels,
  disabled = false,
  errors,
  typeToFetchMap,
}: RuleProps) => {
  const intl = useIntl();
  const { watch, getValues, setValue, formState } = useFormContext<RuleType>();
  const formErrors = getFormErrors(["rewardValue"], errors);

  const { trigger } = useFormContext<RuleType>();
  const { field: nameField } = useController<RuleType, "name">({
    name: "name",
  });

  const { field: channelsfield } = useController<RuleType, "channels">({
    name: "channels",
  });

  const selectedChannels = watch("channels");
  const hasSelectedChannels = !!selectedChannels?.length;
  const currencySymbol = getCurencySymbol(selectedChannels ?? [], channels);

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
        <RuleInputWrapper>
          <Input
            {...nameField}
            disabled={disabled || nameField.disabled}
            size="small"
            label="Name"
            error={!!formState.errors?.name?.message}
            helperText={formState.errors?.name?.message}
          />
        </RuleInputWrapper>

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

        <RuleConditions
          disabled={disabled}
          hasSelectedChannels={hasSelectedChannels}
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
