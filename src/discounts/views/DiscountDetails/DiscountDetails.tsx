import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DiscountDeleteModal } from "@dashboard/discounts/components/DiscountDeleteModal";
import { DiscountDetailsPage } from "@dashboard/discounts/components/DiscountDetailsPage";
import {
  discountListUrl,
  DiscountUrlQueryParams,
} from "@dashboard/discounts/discountsUrls";
import { sortAPIRules } from "@dashboard/discounts/utils";
import {
  PromotionDetailsDocument,
  PromotionDetailsFragment,
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
import React, { useRef, useState } from "react";
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

  const initialLoading = useRef(true);

  const { data: promotionData } = usePromotionDetailsQuery({
    variables: {
      id,
    },
    onCompleted() {
      initialLoading.current = false;
    },
  });

  const { ruleConditionsOptionsDetails, ruleConditionsOptionsDetailsLoading } =
    useFetchConditionsOptionsDetails(promotionData);

  const ruleConditionsOptionsDetailsMap = getRuleConditionsOptionsDetailsMap(
    ruleConditionsOptionsDetails,
  );

  const [promotionUpdate, promotionUpdateOpts] = usePromotionUpdateMutation({
    update(cache, { data }) {
      if (data?.promotionUpdate?.errors?.length === 0) {
        const { promotion } = cache.readQuery<{
          promotion: PromotionDetailsFragment;
        }>({
          query: PromotionDetailsDocument,
          variables: {
            id,
          },
        });

        cache.writeQuery({
          query: PromotionDetailsDocument,
          data: {
            promotion: {
              ...promotion,
              ...data.promotionUpdate.promotion,
            },
          },
        });
      }
    },
    onCompleted(data) {
      if (data?.promotionUpdate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
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
      update(cache, { data }) {
        if (data?.promotionRuleUpdate?.errors?.length === 0) {
          const { promotion } = cache.readQuery<{
            promotion: PromotionDetailsFragment;
          }>({
            query: PromotionDetailsDocument,
            variables: {
              id,
            },
          });

          cache.writeQuery({
            query: PromotionDetailsDocument,
            data: {
              promotion: {
                ...promotion,
                rules: sortAPIRules([
                  ...promotion.rules?.filter(
                    rule =>
                      rule.id !== data.promotionRuleUpdate?.promotionRule?.id,
                  ),
                  data.promotionRuleUpdate?.promotionRule,
                ]),
              },
            },
          });
        }
      },
      onCompleted(data) {
        if (data?.promotionRuleUpdate?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const [promotionRuleCreate, promotionRuleCreateOpts] =
    usePromotionRuleCreateMutation({
      update(cache, { data }) {
        if (data?.promotionRuleCreate?.errors?.length === 0) {
          const { promotion } = cache.readQuery<{
            promotion: PromotionDetailsFragment;
          }>({
            query: PromotionDetailsDocument,
            variables: {
              id,
            },
          });

          cache.writeQuery({
            query: PromotionDetailsDocument,
            data: {
              promotion: {
                ...promotion,
                rules: sortAPIRules([
                  ...promotion.rules,
                  data.promotionRuleCreate.promotionRule,
                ]),
              },
            },
          });
        }
      },
      onCompleted(data) {
        if (data?.promotionRuleCreate?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const [promotionRuleDelete, promotionRuleDeleteOpts] =
    usePromotionRuleDeleteMutation({
      update(cache, { data }) {
        if (data?.promotionRuleDelete?.errors?.length === 0) {
          const { promotion } = cache.readQuery<{
            promotion: PromotionDetailsFragment;
          }>({
            query: PromotionDetailsDocument,
            variables: {
              id,
            },
          });

          cache.writeQuery({
            query: PromotionDetailsDocument,
            data: {
              promotion: {
                ...promotion,
                rules: promotion.rules.filter(
                  rule => rule.id !== data.promotionRuleDelete.promotionRule.id,
                ),
              },
            },
          });
        }
      },
      onCompleted(data) {
        if (data?.promotionRuleDelete?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
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
          initialLoading.current ||
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
