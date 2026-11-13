import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type Rule } from "@dashboard/discounts/models/Rule";
import { useLabelMapsContext } from "@dashboard/discounts/views/DiscountDetails/context/context";
import { type ChannelFragment, type PromotionTypeEnum } from "@dashboard/graphql";
import { type CommonError } from "@dashboard/utils/errors/common";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton/AddButton";
import { RuleDeleteModal } from "./componenets/RuleDeleteModal/RuleDeleteModal";
import { RuleForm } from "./componenets/RuleForm/RuleForm";
import { RuleFormModal } from "./componenets/RuleFormModal/RuleFormModal";
import { RulesList } from "./componenets/RulesList/RulesList";
import { DiscountRulesContextProvider } from "./context/provider";
import { useGraphQLPlayground } from "./hooks/useGraphQLPlayground";
import { messages } from "./messages";

export type DiscountRulesErrors<ErrorCode> = Array<CommonError<ErrorCode> & { index?: number }>;

interface DiscountRulesProps<ErrorCode> {
  disabled: boolean;
  discountType: PromotionTypeEnum;
  channels: ChannelFragment[];
  rules: Rule[];
  promotionId: string | null;
  errors: Array<CommonError<ErrorCode>>;
  deleteButtonState: ConfirmButtonTransitionState;
  getRuleConfirmButtonState: (ruleEditIndex: number | null) => ConfirmButtonTransitionState;
  /** Resolves to `false` when saving the rule failed, so the dialog stays open with the error. */
  onRuleSubmit: (data: Rule, ruleIndex: number | null) => void | Promise<boolean | void>;
  onRuleDelete: (ruleIndex: number) => void | Promise<boolean>;
}

export const DiscountRules = <ErrorCode,>({
  disabled,
  channels,
  rules,
  errors,
  getRuleConfirmButtonState,
  deleteButtonState,
  discountType,
  onRuleSubmit,
  onRuleDelete,
  promotionId,
}: DiscountRulesProps<ErrorCode>) => {
  const intl = useIntl();
  const { ruleConditionsValues } = useLabelMapsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleEditIndex, setRuleEditIndex] = useState<number | null>(null);
  const [ruleDeleteIndex, setRuleDeleteIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // The API's errors belong to the dialog whose save failed; a dialog opened later starts clean.
  const [saveFailed, setSaveFailed] = useState(false);
  const { opepnGrapQLPlayground } = useGraphQLPlayground();

  useEffect(
    function markRulesLoadedWhenEnabled() {
      if (!isLoaded && !disabled) {
        setIsLoaded(true);
      }
    },
    [disabled, isLoaded],
  );

  const ruleInitialValues = useMemo(() => {
    return ruleEditIndex !== null ? rules[ruleEditIndex] : null;
  }, [ruleEditIndex, rules]);
  const handleRuleEdit = (editIndex: number) => {
    setRuleEditIndex(editIndex);
    setIsModalOpen(true);
  };
  const handleOpenRuleDeleteModal = (index: number) => {
    setRuleDeleteIndex(index);
  };
  const handleRuleModalClose = () => {
    setIsModalOpen(false);
    setRuleEditIndex(null);
    setSaveFailed(false);
  };
  const handleRuleModalSubmit = async (data: Rule) => {
    setSaveFailed(false);

    const saved = await onRuleSubmit(data, ruleEditIndex);

    // Keep the merchant's draft, and the error the form now shows, when the save failed.
    if (saved === false) {
      setSaveFailed(true);

      return;
    }

    handleRuleModalClose();
  };
  const handleRuleDelete = async () => {
    const index = ruleDeleteIndex;

    if (index === null) {
      return;
    }

    const result = onRuleDelete(index);

    if (result instanceof Promise) {
      const success = await result;

      if (success !== false) {
        setRuleDeleteIndex(null);
      }

      return;
    }

    setRuleDeleteIndex(null);
  };
  const handleOpenPlayground = () => {
    setIsModalOpen(false);
    opepnGrapQLPlayground(promotionId);
  };

  return (
    <DiscountRulesContextProvider
      discountType={discountType}
      channels={channels}
      disabled={disabled}
    >
      <DetailSettingsCard
        data-test-id="discount-rules-section"
        title={intl.formatMessage(messages.title)}
        intro={
          <Text size={3} color="default2">
            {intl.formatMessage(messages.titleDescription)}
          </Text>
        }
        headerEnd={<AddButton onClick={() => setIsModalOpen(true)} />}
      >
        <Box data-test-id="rule-list">
          <RulesList
            loading={!isLoaded || ruleConditionsValues.loading}
            rules={rules}
            onRuleEdit={handleRuleEdit}
            onRuleDelete={handleOpenRuleDeleteModal}
            errors={errors}
          />
        </Box>
      </DetailSettingsCard>

      {isModalOpen && (
        <RuleFormModal
          confirmButtonState={getRuleConfirmButtonState(ruleEditIndex)}
          onClose={handleRuleModalClose}
          initialFormValues={ruleInitialValues}
          onSubmit={handleRuleModalSubmit}
        >
          <RuleForm errors={saveFailed ? errors : []} openPlayground={handleOpenPlayground} />
        </RuleFormModal>
      )}
      <RuleDeleteModal
        confirmButtonState={deleteButtonState}
        open={ruleDeleteIndex !== null}
        onClose={() => setRuleDeleteIndex(null)}
        onConfirm={handleRuleDelete}
      />
    </DiscountRulesContextProvider>
  );
};
