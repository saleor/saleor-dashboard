import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountCreatePage } from "@dashboard/discounts/components/DiscountCreatePage";
import {
  discountListUrl,
  discountUrl,
} from "@dashboard/discounts/discountsUrls";
import { usePromotionCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import React from "react";
import { useIntl } from "react-intl";

import { useDiscountCreate } from "./handlers";

export const DiscountCreate = () => {
  const { availableChannels } = useAppChannel(false);
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [promotionCreate, promotionCreateOpts] = usePromotionCreateMutation({
    onCompleted(data) {
      if (data?.promotionCreate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "5dOOAB",
            defaultMessage: "Successfully created discount",
          }),
        });
        navigate(discountUrl(data?.promotionCreate?.promotion?.id ?? ""), {
          replace: true,
        });
      }
    },
  });

  const handlePromotionCreate = useDiscountCreate(variables =>
    promotionCreate({ variables }),
  );

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountCreatePage
        disabled={promotionCreateOpts.loading}
        onBack={() => {
          navigate(discountListUrl());
        }}
        errors={getMutationErrors(promotionCreateOpts)}
        channels={availableChannels}
        submitButtonState={promotionCreateOpts.status}
        onSubmit={handlePromotionCreate}
      />
    </>
  );
};
