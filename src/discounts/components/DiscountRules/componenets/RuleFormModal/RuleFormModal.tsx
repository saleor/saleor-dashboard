import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Rule } from "@dashboard/discounts/models";
import { ChannelFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { CommonError } from "@dashboard/utils/errors/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { DiscountRulesContextProvider } from "../../context/provider";
import { messages } from "../../messages";
import { RuleForm } from "../RuleForm/RuleForm";
import { defaultFormValues } from "./defaultFormValues";
import { getValidationSchema } from "./validationSchema";

interface RuleFormModalProps<ErrorCode> {
  disabled: boolean;
  onClose: () => void;
  onSubmit: (data: Rule) => void;
  discountType: PromotionTypeEnum;
  confimButtonState: ConfirmButtonTransitionState;
  channels: ChannelFragment[];
  initialFormValues?: Rule | null;
  errors: Array<CommonError<ErrorCode>>;
}

export const RuleFormModal = <ErrorCode,>({
  disabled,
  discountType,
  onClose,
  channels,
  initialFormValues,
  confimButtonState,
  onSubmit,
  errors,
}: RuleFormModalProps<ErrorCode>) => {
  const intl = useIntl();

  const methods = useForm<Rule>({
    mode: "onBlur",
    values: initialFormValues || defaultFormValues,
    resolver: zodResolver(getValidationSchema(intl)),
  });

  const channel = methods.watch("channel");
  const channelSlug =
    channels?.find(chan => chan.id === channel?.value)?.slug ?? "";

  return (
    <DiscountRulesContextProvider
      discountType={discountType}
      channel={channelSlug}
    >
      <DashboardModal open={true} onChange={onClose}>
        <DashboardModal.Content>
          <DashboardModal.Title
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormattedMessage
              {...(initialFormValues ? messages.editRule : messages.addRule)}
            />
            <DashboardModal.Close onClose={onClose} />
          </DashboardModal.Title>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box
                __width={650}
                __minHeight={515}
                __maxHeight="75vh"
                overflowY="auto"
              >
                <RuleForm
                  channels={channels}
                  errors={errors}
                  disabled={disabled}
                />
              </Box>
            </form>
          </FormProvider>
          <DashboardModal.Actions>
            <Button onClick={onClose} variant="secondary">
              <FormattedMessage {...buttonMessages.close} />
            </Button>
            <ConfirmButton
              data-test-id="saveRuleButton"
              transitionState={confimButtonState}
              onClick={methods.handleSubmit(onSubmit)}
            >
              <FormattedMessage {...buttonMessages.save} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>
    </DiscountRulesContextProvider>
  );
};
