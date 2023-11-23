import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import { DiscountUrlQueryParams, saleListUrl } from "@dashboard/discounts/urls";
import {
  useConditionsDetailsQuery,
  usePromotionDetailsQuery,
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

  const { data, loading } = usePromotionDetailsQuery({
    variables: {
      id,
    },
  });

  const { data: conditionData } = useConditionsDetailsQuery({
    variables: {
      ...getAllConditionsIds(data),
    },
  });

  const [promotionUpdate, promotionUpdateOpts] = usePromotionUpdateMutation({
    onCompleted: data => {
      if (data.promotionUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(saleListUrl());
      }
    },
  });

  const fetchOptions = useOptionsFetch();

  const onSubmit = createUpdateHandler(id, variables =>
    promotionUpdate({ variables }),
  );

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountDetailsPage
        data={data?.promotion}
        disabled={loading || promotionUpdateOpts.loading}
        conditionLabels={getConditonLabels(conditionData)}
        onBack={() => {
          navigate(saleListUrl());
        }}
        fetchOptions={fetchOptions}
        channels={availableChannels}
        onSubmit={onSubmit}
        submitButtonState={promotionUpdateOpts.status}
        onRuleSubmit={() => {}} // To be implemented
      />
    </>
  );
};
