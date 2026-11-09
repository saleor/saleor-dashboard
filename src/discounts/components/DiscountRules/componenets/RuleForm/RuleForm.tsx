import { createEmptyCodition } from "@dashboard/discounts/models/Condition";
import { type Rule } from "@dashboard/discounts/models/Rule";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { type CommonError, getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Combobox, Input, type Option } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { useDiscountRulesContext } from "../../context/consumer";
import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { RuleConditions } from "./components/RuleConditions/RuleConditions";
import { RuleDescription } from "./components/RuleDescription/RuleDescription";
import { RuleInputWrapper } from "./components/RuleInputWrapper/RuleInputWrapper";
import { RuleReward } from "./components/RuleReward/RuleReward";

interface RuleFormProps<ErrorCode> {
  errors: Array<CommonError<ErrorCode>>;
  openPlayground: () => void;
}

export const RuleForm = <ErrorCode,>({ errors, openPlayground }: RuleFormProps<ErrorCode>) => {
  const intl = useIntl();
  const { disabled, channels, discountType } = useDiscountRulesContext();
  const { watch, getValues, setValue, formState } = useFormContext<Rule>();
  const formErrors = getFormErrors(["rewardValue"], errors);
  const { trigger, setError, clearErrors, getFieldState } = useFormContext<Rule>();
  const apiRewardError = getCommonFormFieldErrorMessage(formErrors.rewardValue, intl);
  const rewardValue = watch("rewardValue");

  // The API's error for the reward is shown as the field's own error, so it doesn't hide the
  // form's own checks.
  useEffect(
    function showApiRewardError() {
      if (apiRewardError) {
        setError("rewardValue", { type: "server", message: apiRewardError });
      }
    },
    [apiRewardError, setError],
  );
  // Once the value changes, the API's verdict no longer applies; the form checks it again on blur
  // and on save.
  useEffect(
    function clearApiRewardErrorOnChange() {
      if (getFieldState("rewardValue").error?.type === "server") {
        clearErrors("rewardValue");
      }
    },
    [rewardValue, clearErrors, getFieldState],
  );

  const { field: nameField } = useController<Rule, "name">({
    name: "name",
  });
  const { field: channelfield } = useController<Rule, "channel">({
    name: "channel",
  });
  const selectedChannel = watch("channel");
  // A rule made through the API can apply in more channels than this form edits. Name them, and
  // don't offer to move the rule, since the form can't say what should happen to the others.
  const otherChannels = watch("otherChannels") ?? [];
  const otherChannelsNote =
    otherChannels.length > 0
      ? intl.formatMessage(messages.ruleOtherChannels, {
          channels: intl.formatList(otherChannels.map(channel => channel.name)),
        })
      : undefined;
  const conditions = watch("conditions");
  const hasSelectedChannel = !!selectedChannel;
  const currencySymbol = getCurencySymbol(selectedChannel, channels);
  const initialDescription = useRef(getValues("description"));
  const richText = useRichText({
    initial: initialDescription.current,
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

  const handleChannelChange = (e: ChangeEvent) => {
    const channelId = e.target.value;
    const channel = channels.find(channel => channel.id === channelId);

    if (channel) {
      setValue("channel", { value: channel.id, label: channel.name }, { shouldValidate: true });
    }

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
      <Box width="100%">
        <Box display="flex" flexDirection="column" gap={5}>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="start">
            <Box __flex="1 1 280px" __minWidth="280px">
              <RuleInputWrapper>
                <Input
                  {...nameField}
                  data-test-id="rule-name-input"
                  disabled={disabled || nameField.disabled}
                  size="small"
                  label={intl.formatMessage(commonMessages.name)}
                  error={!!formState.errors?.name?.message}
                  helperText={formState.errors?.name?.message}
                />
              </RuleInputWrapper>
            </Box>

            <Box __flex="1 1 280px" __minWidth="280px">
              <RuleInputWrapper>
                <Combobox
                  {...channelfield}
                  onChange={v =>
                    handleChannelChange({
                      target: {
                        name: channelfield.name,
                        value: v?.value ?? "",
                      },
                    })
                  }
                  size="small"
                  data-test-id="channel-dropdown"
                  label={intl.formatMessage(commonMessages.channel)}
                  options={channelOptions}
                  error={!!formState.errors?.channel?.message}
                  helperText={formState.errors?.channel?.message ?? otherChannelsNote}
                  disabled={disabled || channelfield.disabled || otherChannels.length > 0}
                />
              </RuleInputWrapper>
            </Box>

            <Box
              __flex="1 1 260px"
              __minWidth={discountType === PromotionTypeEnum.ORDER ? "420px" : "260px"}
            >
              <RuleReward currencySymbol={currencySymbol} />
            </Box>
          </Box>

          <Box
            borderRadius={4}
            borderWidth={1}
            borderStyle="solid"
            borderColor="default1"
            backgroundColor="default2"
            padding={4}
          >
            <RuleConditions
              hasSelectedChannels={hasSelectedChannel}
              openPlayground={openPlayground}
            />
          </Box>

          <RuleDescription />

          <button type="submit" hidden>
            Submit
          </button>
        </Box>
      </Box>
    </RichTextContext.Provider>
  );
};
