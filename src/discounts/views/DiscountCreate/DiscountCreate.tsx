import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountCreatePage } from "@dashboard/discounts/components/DiscountCreatePage";
import { DiscountUrlQueryParams } from "@dashboard/discounts/urls";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

interface DiscountCreateProps {
  params: DiscountUrlQueryParams;
}

export const DiscountCreate = (props: DiscountCreateProps) => {
  const { availableChannels } = useAppChannel(false);
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountCreatePage
        disabled={false}
        onBack={() => {}}
        channels={availableChannels}
      />
    </>
  );
};
