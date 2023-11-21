import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountCreatePage } from "@dashboard/discounts/components/DiscountCreatePage";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { saleListUrl, saleUrl } from "@dashboard/discounts/urls";
import { usePromotionCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { joinDateTime } from "@dashboard/misc";
import React from "react";
import { useIntl } from "react-intl";

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

  const fetchOptionsByType = useOptionsFetch();

  const handlePromotionCreate = (data: DiscoutFormData) => {
    promotionCreate({
      variables: {
        input: {
          name: data.name,
          description: JSON.parse(data.description),
          endDate: data.dates.hasEndDate
            ? joinDateTime(data.dates.endDate, data.dates.endTime)
            : null,
          startDate: joinDateTime(data.dates.startDate, data.dates.startTime),
          rules: data.rules.map(rule => ({
            name: rule.name,
            description: JSON.parse(rule.description),
            channels: rule.channels.map(chan => chan.value),
            rewardValue: rule.rewardValue,
            rewardValueType: rule.rewardValueType,
            cataloguePredicate: {
              OR: rule.conditions.reduce((acc, condition) => {
                if (condition.type === "products") {
                  acc.push({
                    productPredicate: {
                      ids: condition.values.map(val => val.value),
                    },
                  });
                }

                if (condition.type === "categories") {
                  acc.push({
                    categoryPredicate: {
                      ids: condition.values.map(val => val.value),
                    },
                  });
                }

                if (condition.type === "collections") {
                  acc.push({
                    collectionPredicate: {
                      ids: condition.values.map(val => val.value),
                    },
                  });
                }

                if (condition.type === "variants") {
                  acc.push({
                    variantPredicate: {
                      ids: condition.values.map(val => val.value),
                    },
                  });
                }

                return acc;
              }, []),
            },
          })),
        },
      },
    });
  };

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
