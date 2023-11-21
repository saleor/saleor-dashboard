import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountCreatePage } from "@dashboard/discounts/components/DiscountCreatePage";
import { saleListUrl, saleUrl } from "@dashboard/discounts/urls";
import { usePromotionCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import { createHandler } from "./handlers";
import { useOptionsFetch } from "./hooks/useOptionsFetch";

export const DiscountCreate = () => {
  const { availableChannels } = useAppChannel(false);
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [promotionCreate, promotionCreateOpts] = usePromotionCreateMutation({
    onCompleted(data) {
      if (data.promotionCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "5dOOAB",
            defaultMessage: "Successfully created discount",
          }),
        });
        navigate(saleUrl(data.promotionCreate.promotion.id), { replace: true });
      }
    },
  });

  const handlePromotionCreate = createHandler(variables =>
    promotionCreate({ variables }),
  );

  const fetchOptionsByType = useOptionsFetch();

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountCreatePage
        disabled={promotionCreateOpts.loading}
        onBack={() => {
          navigate(saleListUrl());
        }}
        fetchOptions={fetchOptionsByType}
        channels={availableChannels}
        onSubmit={handlePromotionCreate}
      />
    </>
  );
};
