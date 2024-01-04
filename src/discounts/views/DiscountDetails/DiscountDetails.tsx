import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDeleteModal } from "@dashboard/discounts/components/DiscountDeleteModal";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import {
  discountListUrl,
  DiscountUrlQueryParams,
} from "@dashboard/discounts/discountsUrls";
import useNavigator from "@dashboard/hooks/useNavigator";
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
import { usePromotionData } from "./hooks/usePromotionData";
import { usePromotionDelete } from "./hooks/usePromotionDelete";
import { usePromotionRuleCreate } from "./hooks/usePromotionRuleCreate";
import { usePromotionRuleDelete } from "./hooks/usePromotionRuleDelete";
import { usePromotionRuleUpdate } from "./hooks/usePromotionRuleUpdate";
import { usePromotionUpdate } from "./hooks/usePromotionUpdate";

interface DiscountDetailsProps {
  id: string;
  params: DiscountUrlQueryParams;
}

export const DiscountDetails = ({ id }: DiscountDetailsProps) => {
  const { availableChannels } = useAppChannel(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigator();
  const intl = useIntl();

  const { promotionData, loading } = usePromotionData(id);

  const { ruleConditionsOptionsDetails, ruleConditionsOptionsDetailsLoading } =
    useFetchConditionsOptionsDetails(promotionData);

  const ruleConditionsOptionsDetailsMap = getRuleConditionsOptionsDetailsMap(
    ruleConditionsOptionsDetails,
  );

  const { promotionUpdate, promotionUpdateOpts } = usePromotionUpdate(id);

  const { promotionDelete, promotionDeleteOpts } = usePromotionDelete();

  const { promotionRuleUpdate, promotionRuleUpdateOpts } =
    usePromotionRuleUpdate(id);

  const { promotionRuleCreate, promotionRuleCreateOpts } =
    usePromotionRuleCreate(id);

  const { promotionRuleDelete, promotionRuleDeleteOpts } =
    usePromotionRuleDelete(id);

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
        ruleConditionsOptionsDetailsMap={ruleConditionsOptionsDetailsMap}
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
