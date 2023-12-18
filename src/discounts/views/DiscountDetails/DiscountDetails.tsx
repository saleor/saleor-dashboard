import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDeleteModal } from "@dashboard/discounts/components/DiscountDeleteModal";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import {
  discountListUrl,
  DiscountUrlQueryParams,
} from "@dashboard/discounts/discountsUrls";
import {
  usePromotionDeleteMutation,
  usePromotionDetailsQuery,
  usePromotionRuleCreateMutation,
  usePromotionRuleDeleteMutation,
  usePromotionRuleUpdateMutation,
  usePromotionUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import {
  createRuleCreateHandler,
  createRuleUpdateHandler,
  createUpdateHandler,
} from "./handlers";
import {
  getRuleConditionsOptionsDetailsMap,
  useFetchConditionsOptionsDetails,
} from "./hooks/useFetchConditionsOptionsDetails";

interface DiscountDetailsProps {
  id: string;
  params: DiscountUrlQueryParams;
}

export const DiscountDetails = ({ id }: DiscountDetailsProps) => {
  const notify = useNotifier();
  const { availableChannels } = useAppChannel(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigator();
  const intl = useIntl();

  const {
    data: promotionData,
    loading,
    refetch,
  } = usePromotionDetailsQuery({
    variables: {
      id,
    },
  });

  const { ruleConditionsOptionsDetails, ruleConditionsOptionsDetailsLoading } =
    useFetchConditionsOptionsDetails(promotionData);

  const [promotionUpdate, promotionUpdateOpts] = usePromotionUpdateMutation({
    onCompleted(data) {
      if (data?.promotionUpdate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
      }
    },
  });

  const [promotionDelete, promotionDeleteOpts] = usePromotionDeleteMutation({
    onCompleted(data) {
      if (data?.promotionDelete?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "4LRapg",
            defaultMessage: "Discount removed",
          }),
        });
        navigate(discountListUrl());
      }
    },
  });

  const [promotionRuleUpdate, promotionRuleUpdateOpts] =
    usePromotionRuleUpdateMutation({
      onCompleted(data) {
        if (data?.promotionRuleUpdate?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          refetch();
        }
      },
    });

  const [promotionRuleCreate, promotionRuleCreateOpts] =
    usePromotionRuleCreateMutation({
      onCompleted(data) {
        if (data?.promotionRuleCreate?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          refetch();
        }
      },
    });

  const [promotionRuleDelete, promotionRuleDeleteOpts] =
    usePromotionRuleDeleteMutation({
      onCompleted(data) {
        if (data?.promotionRuleDelete?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          refetch();
        }
      },
    });

  const onSubmit = createUpdateHandler(promotionData?.promotion, variables =>
    promotionUpdate({ variables }),
  );

  const onRuleUpdateSubmit = createRuleUpdateHandler(
    promotionData?.promotion,
    variables => promotionRuleUpdate({ variables }),
  );

  const onRuleCreateSubmit = createRuleCreateHandler(
    promotionData?.promotion,
    variables => promotionRuleCreate({ variables }),
  );

  const onRuleDeleteSubmit = (id: string) => {
    return promotionRuleDelete({
      variables: {
        id,
      },
    });
  };

  const onPromotionDelete = () => {
    promotionDelete({
      variables: {
        id,
      },
    });
  };

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountDetailsPage
        data={promotionData?.promotion}
        errors={getMutationErrors(promotionUpdateOpts)}
        disabled={
          loading ||
          promotionUpdateOpts.loading ||
          promotionDeleteOpts.loading ||
          promotionRuleUpdateOpts.loading ||
          promotionRuleCreateOpts.loading ||
          promotionRuleDeleteOpts.loading
        }
        ruleConditionsOptionsDetailsMap={getRuleConditionsOptionsDetailsMap(
          ruleConditionsOptionsDetails,
        )}
        ruleConditionsOptionsDetailsLoading={
          ruleConditionsOptionsDetailsLoading
        }
        onBack={() => {
          navigate(discountListUrl());
        }}
        channels={availableChannels}
        onSubmit={onSubmit}
        onDelete={() => setOpenModal(true)}
        submitButtonState={promotionUpdateOpts.status}
        onRuleUpdateSubmit={onRuleUpdateSubmit}
        ruleUpdateButtonState={promotionRuleUpdateOpts.status}
        onRuleCreateSubmit={onRuleCreateSubmit}
        ruleCreateButtonState={promotionRuleCreateOpts.status}
        onRuleDeleteSubmit={onRuleDeleteSubmit}
        ruleDeleteButtonState={promotionRuleDeleteOpts.status}
      />

      <DiscountDeleteModal
        confirmButtonTransitionState={promotionDeleteOpts.status}
        onChange={() => setOpenModal(false)}
        onConfirm={onPromotionDelete}
        open={openModal}
      />
    </>
  );
};
