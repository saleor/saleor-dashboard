import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Rule } from "@dashboard/discounts/models";
import { ChannelFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { CommonError } from "@dashboard/utils/errors/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ConditionType } from "../../../../types";
import { messages } from "../../messages";
import { FetchOptions } from "../RuleForm/components/RuleConditionRow";
import { useCategorieSearch } from "../RuleForm/components/RuleConditions/hooks/useCategorieSearch";
import { useCollectionSearch } from "../RuleForm/components/RuleConditions/hooks/useCollectionSearch";
import { useProductSearch } from "../RuleForm/components/RuleConditions/hooks/useProductSearch";
import { useVariantSearch } from "../RuleForm/components/RuleConditions/hooks/useVariantSearch";
import { RuleForm } from "../RuleForm/RuleForm";
import { getValidationSchema } from "./validationSchema";

interface RuleFormModalProps<ErrorCode> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Rule) => void;
  confimButtonState: ConfirmButtonTransitionState;
  channels: ChannelFragment[];
  initialFormValues?: Rule;
  errors: Array<CommonError<ErrorCode>>;
}

export const RuleFormModal = <ErrorCode,>({
  open,
  onClose,
  channels,
  initialFormValues,
  confimButtonState,
  onSubmit,
  errors,
}: RuleFormModalProps<ErrorCode>) => {
  const intl = useIntl();

  const { toAPI, ...emptyRule } = Rule.empty();

  const methods = useForm<Rule>({
    mode: "onBlur",
    values: initialFormValues || { ...emptyRule, toAPI },
    resolver: zodResolver(getValidationSchema(intl)),
  });

  const channel = methods.watch("channel");
  const channelSlug =
    channels?.find(chan => chan.id === channel?.value)?.slug ?? "";

  const productSearch = useProductSearch(channelSlug);
  const collectionSearch = useCollectionSearch(channelSlug);
  const categorySearch = useCategorieSearch();
  const variantSearch = useVariantSearch(channelSlug);

  const typeToFetchMap: Record<ConditionType, FetchOptions> = {
    product: productSearch,
    collection: collectionSearch,
    category: categorySearch,
    variant: variantSearch,
  };

  // Clear modal form
  useEffect(() => {
    if (!initialFormValues && open) {
      methods.reset(Rule.empty());
    }
  }, [open]);

  return (
    <DashboardModal open={open} onChange={onClose}>
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
                disabled={false}
                typeToFetchMap={typeToFetchMap}
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
  );
};
