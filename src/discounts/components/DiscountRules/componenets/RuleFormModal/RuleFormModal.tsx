import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Rule } from "@dashboard/discounts/models";
import { buttonMessages } from "@dashboard/intl";
import { CommonError } from "@dashboard/utils/errors/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ConditionType } from "../../../../types";
import { useDiscountRulesContext } from "../../context";
import { messages } from "../../messages";
import { FetchOptions } from "../RuleForm/components/RuleConditionRow";
import { useCategorieOptions } from "../RuleForm/components/RuleConditions/hooks/useCategorieOptions";
import { useCollectionOptions } from "../RuleForm/components/RuleConditions/hooks/useCollectionOptions";
import { useProductOptions } from "../RuleForm/components/RuleConditions/hooks/useProductOptions";
import { useVariantOptions } from "../RuleForm/components/RuleConditions/hooks/useVariantOptions";
import { RuleForm } from "../RuleForm/RuleForm";
import { defaultFormValues } from "./defaultFormValues";
import { getValidationSchema } from "./validationSchema";

interface RuleFormModalProps<ErrorCode> {
  onClose: () => void;
  onSubmit: (data: Rule) => void;
  confimButtonState: ConfirmButtonTransitionState;
  initialFormValues?: Rule | null;
  errors: Array<CommonError<ErrorCode>>;
}

export const RuleFormModal = <ErrorCode,>({
  onClose,
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

  const { channels } = useDiscountRulesContext();

  const channel = methods.watch("channel");
  const channelSlug =
    channels?.find(chan => chan.id === channel?.value)?.slug ?? "";

  const productSearch = useProductOptions(channelSlug);
  const collectionSearch = useCollectionOptions(channelSlug);
  const categorySearch = useCategorieOptions();
  const variantSearch = useVariantOptions(channelSlug);

  const typeToFetchMap: Record<ConditionType, FetchOptions> = {
    product: productSearch,
    collection: collectionSearch,
    category: categorySearch,
    variant: variantSearch,
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
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box
              __width={650}
              __minHeight={515}
              __maxHeight="75vh"
              overflowY="auto"
            >
              <RuleForm errors={errors} typeToFetchMap={typeToFetchMap} />
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
  );
};
