import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { initialRuleValues } from "@dashboard/discounts/components/DiscountCreatePage/initialFormValues";
import {
  ChannelFragment,
  PromotionCreateErrorFragment,
} from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { CommonError } from "@dashboard/utils/errors/common";
import { Box, Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { Rule as RuleType } from "../../../../types";
import { messages } from "../../messages";
import { Rule } from "../Rule/Rule";

interface RuleModalProps {
  onClose: () => void;
  onSubmit: (data: RuleType) => Promise<void>;
  confimButtonState: ConfirmButtonTransitionState;
  channels: ChannelFragment[];
  initialFormValues?: RuleType;
  errors: Array<CommonError<PromotionCreateErrorFragment["code"]>>;
}

export const RuleModal = ({
  onClose,
  channels,
  initialFormValues,
  confimButtonState,
  onSubmit,
  errors,
}: RuleModalProps) => {
  const methods = useForm<RuleType>({
    mode: "onBlur",
    values: initialFormValues || initialRuleValues,
  });

  const handleSubmit: SubmitHandler<RuleType> = async data => {
    await onSubmit(data);
  };

  return (
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
        <Box __width={650}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Rule channels={channels} errors={errors} disabled={false} />
            </form>
          </FormProvider>
        </Box>
        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            <FormattedMessage {...buttonMessages.close} />
          </Button>
          <ConfirmButton
            transitionState={confimButtonState}
            onClick={methods.handleSubmit(handleSubmit)}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
