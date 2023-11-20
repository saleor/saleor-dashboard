import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import { discount } from "@dashboard/discounts/fixtures";
import { DiscountUrlQueryParams, saleListUrl } from "@dashboard/discounts/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

export interface DiscountDetailsProps {
  id: string;
  params: DiscountUrlQueryParams;
}

export const DiscountDetails = () => {
  const { availableChannels } = useAppChannel(false);
  const navigate = useNavigator();
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountDetailsPage
        disabled={false}
        onBack={() => {
          navigate(saleListUrl());
        }}
        channels={availableChannels}
        discount={discount}
        onSubmit={() => {}} // To be implemented
        onRuleSubmit={() => {}} // To be implemented
      />
    </>
  );
};
