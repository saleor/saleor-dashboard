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
import React from "react";
import { useIntl } from "react-intl";

import { useOptionsFetch } from "../DiscountCreate/hooks/useOptionsFetch";
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

  const [promotionUpdate, promotionUpdateOpts] = usePromotionUpdateMutation({
    onCompleted: data => {
      if (data.promotionUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const [promotionRuleUpdate, promotionRuleUpdateOpts] =
    usePromotionRuleUpdateMutation({
      onCompleted: data => {
        if (data.promotionRuleUpdate.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const [promotionRuleCreate, promotionRuleCreateOpts] =
    usePromotionRuleCreateMutation({
      onCompleted: data => {
        if (data.promotionRuleCreate.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const fetchOptions = useOptionsFetch();

  const onSubmit = createUpdateHandler(
    promotionData?.promotion,
    variables => promotionUpdate({ variables }),
    variables => promotionRuleUpdate({ variables }),
    variables => promotionRuleCreate({ variables }),
  );

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountDetailsPage
        data={promotionData?.promotion}
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
        fetchOptions={fetchOptions}
        channels={availableChannels}
        onSubmit={onSubmit}
        submitButtonState={promotionUpdateOpts.status}
      />
    </>
  );
};
