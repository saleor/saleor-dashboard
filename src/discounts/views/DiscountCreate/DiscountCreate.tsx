import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountCreatePage } from "@dashboard/discounts/components/DiscountCreatePage";
import { saleListUrl } from "@dashboard/discounts/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

export const DiscountCreate = () => {
  const { availableChannels } = useAppChannel(false);
  const navigate = useNavigator();
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountCreatePage
        disabled={false}
        onBack={() => {
          navigate(saleListUrl());
        }}
        channels={availableChannels}
        onSubmit={() => {}} // To be implemented
      />
    </>
  );
};
