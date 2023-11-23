import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import { DiscountUrlQueryParams, saleListUrl } from "@dashboard/discounts/urls";
import {
  useConditionsDetailsQuery,
  usePromotionDetailsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import { getAllConditionsIds, getConditonLabels } from "./utils";

interface DiscountDetailsProps {
  id: string;
  params: DiscountUrlQueryParams;
}

export const DiscountDetails = ({ id }: DiscountDetailsProps) => {
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

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountDetailsPage
        data={data?.promotion}
        disabled={loading}
        conditionLabels={getConditonLabels(conditionData)}
        onBack={() => {
          navigate(saleListUrl());
        }}
        channels={availableChannels}
        onSubmit={() => {}} // To be implemented
        onRuleSubmit={() => {}} // To be implemented
      />
    </>
  );
};
