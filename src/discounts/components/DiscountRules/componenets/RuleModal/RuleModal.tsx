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
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ConditionType, Rule as RuleType } from "../../../../types";
import { messages } from "../../messages";
import { FetchOptions } from "../Rule/components/RuleConditionRow";
import { useCategorieSearch } from "../Rule/components/RuleConditions/hooks/useCategorieSearch";
import { useCollectionSearch } from "../Rule/components/RuleConditions/hooks/useCollectionSearch";
import { useProductSearch } from "../Rule/components/RuleConditions/hooks/useProductSearch";
import { useVariantSearch } from "../Rule/components/RuleConditions/hooks/useVariantSearch";
import { Rule } from "../Rule/Rule";
import { getValidationSchema } from "./validationSchema";

interface RuleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RuleType) => Promise<void>;
  confimButtonState: ConfirmButtonTransitionState;
  channels: ChannelFragment[];
  initialFormValues?: RuleType;
  errors: Array<CommonError<PromotionCreateErrorFragment["code"]>>;
}

export const RuleModal = ({
  open,
  onClose,
  channels,
  initialFormValues,
  confimButtonState,
  onSubmit,
  errors,
}: RuleModalProps) => {
  const intl = useIntl();
  const methods = useForm<RuleType>({
    mode: "onBlur",
    values: initialFormValues || initialRuleValues,
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

  const handleSubmit: SubmitHandler<RuleType> = async data => {
    await onSubmit(data);
  };

  useEffect(() => {
    if (!initialFormValues && open) {
      methods.reset(initialRuleValues);
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
        <Box
          __width={650}
          __maxHeight="75vh"
          __minHeight="515px"
          overflowY="auto"
        >
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Rule
                channels={channels}
                errors={errors}
                disabled={false}
                typeToFetchMap={typeToFetchMap}
              />
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
