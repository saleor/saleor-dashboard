import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import { DiscountUrlQueryParams, saleListUrl } from "@dashboard/discounts/urls";
import {
  useConditionsDetailsQuery,
  usePromotionDetailsQuery,
  usePromotionRuleCreateMutation,
  usePromotionRuleUpdateMutation,
  usePromotionUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import React from "react";
import { useIntl } from "react-intl";

import { createUpdateHandler } from "./handlers";
import { getAllConditionsIds, getConditonLabels } from "./utils";

interface DiscountDetailsProps {
  id: string;
  params: DiscountUrlQueryParams;
}

export const DiscountDetails = ({ id }: DiscountDetailsProps) => {
  const notify = useNotifier();
  const { availableChannels } = useAppChannel(false);
  const navigate = useNavigator();
  const intl = useIntl();

  const { data: promotionData, loading } = usePromotionDetailsQuery({
    variables: {
      id,
    },
  });

  const { data: conditionData } = useConditionsDetailsQuery({
    variables: {
      ...getAllConditionsIds(promotionData),
    },
  });

  const [promotionUpdate, promotionUpdateOpts] = usePromotionUpdateMutation();

  const [promotionRuleUpdate, promotionRuleUpdateOpts] =
    usePromotionRuleUpdateMutation();

  const [promotionRuleCreate, promotionRuleCreateOpts] =
    usePromotionRuleCreateMutation();

  const onSubmit = createUpdateHandler({
    promotion: promotionData?.promotion,
    update: variables => promotionUpdate({ variables }),
    updateRule: variables => promotionRuleUpdate({ variables }),
    createRule: variables => promotionRuleCreate({ variables }),
    successNotification: () => {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    },
  });

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountDetailsPage
        data={promotionData?.promotion}
        errors={getMutationErrors(promotionUpdateOpts)}
        disabled={
          loading ||
          promotionUpdateOpts.loading ||
          promotionRuleCreateOpts.loading ||
          promotionRuleUpdateOpts.loading
        }
        conditionLabels={getConditonLabels(conditionData)}
        onBack={() => {
          navigate(saleListUrl());
        }}
        channels={availableChannels}
        onSubmit={onSubmit}
        submitButtonState={promotionUpdateOpts.status}
      />
    </>
  );
};
