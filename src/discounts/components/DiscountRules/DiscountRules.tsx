import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Rule } from "@dashboard/discounts/models";
import { ChannelFragment } from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { Box } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { RuleDeleteModal } from "./componenets/RuleDeleteModal/RuleDeleteModal";
import { RuleFormModal, RuleModalState } from "./componenets/RuleFormModal";
import { RulesList } from "./componenets/RulesList";
import { messages } from "./messages";

export type DiscountRulesErrors<ErrorCode> = Array<
  CommonError<ErrorCode> & { index?: number }
>;

interface DiscountRulesProps<ErrorCode> {
  disabled: boolean;
  channels: ChannelFragment[];
  rules: Rule[];
  errors: Array<CommonError<ErrorCode>>;
  loading?: boolean;
  deleteButtonState: ConfirmButtonTransitionState;
  getRuleConfirmButtonState: (
    ruleEditIndex: number | null,
  ) => ConfirmButtonTransitionState;
  onRuleSubmit: (data: Rule, ruleIndex: number | null) => void;
  onRuleDelete: (ruleIndex: number) => void;
}

export const DiscountRules = <ErrorCode,>({
  disabled,
  channels,
  rules,
  errors,
  getRuleConfirmButtonState,
  deleteButtonState,
  loading,
  onRuleSubmit,
  onRuleDelete,
}: DiscountRulesProps<ErrorCode>) => {
  const intl = useIntl();

  const [ruleModalState, setRuleModalState] = useState<RuleModalState>({
    open: false,
    type: "catalog",
  });
  const [ruleEditIndex, setRuleEditIndex] = useState<number | null>(null);
  const [ruleDeleteIndex, setRuleDeleteIndex] = useState<number | null>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current && !disabled) {
      isLoaded.current = true;
    }
  }, [disabled]);

  const ruleInitialValues = useMemo(() => {
    return ruleEditIndex !== null ? rules[ruleEditIndex] : null;
  }, [ruleEditIndex]);

  const handleRuleEdit = (editIndex: number) => {
    setRuleEditIndex(editIndex);
    setRuleModalState({
      open: true,
      type: "catalog",
    });
  };

  const handleOpenRuleDeleteModal = (index: number) => {
    setRuleDeleteIndex(index);
  };

  const handleRuleModalClose = () => {
    setRuleModalState({
      open: false,
      type: "catalog",
    });
    setRuleEditIndex(null);
  };

  const handleRuleModalSubmit = async (data: Rule) => {
    await onRuleSubmit(data, ruleEditIndex);
    handleRuleModalClose();
  };

  const handleRuleDelete = async () => {
    await onRuleDelete(ruleDeleteIndex!);
    setRuleDeleteIndex(null);
  };

  return (
    <DashboardCard marginBottom={20}>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton
            disabled={disabled}
            onCatalogClick={() =>
              setRuleModalState({
                open: true,
                type: "catalog",
              })
            }
            onCheckoutClick={() =>
              setRuleModalState({
                open: true,
                type: "checkout",
              })
            }
          />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <RulesList
          disabled={disabled}
          loading={!isLoaded.current || loading}
          rules={rules}
          onRuleEdit={handleRuleEdit}
          onRuleDelete={handleOpenRuleDeleteModal}
          channels={channels}
          errors={errors}
        />
      </DashboardCard.Content>

      <RuleFormModal
        disabled={disabled}
        ruleModalState={ruleModalState}
        confimButtonState={getRuleConfirmButtonState(ruleEditIndex)}
        onClose={handleRuleModalClose}
        channels={channels}
        initialFormValues={ruleInitialValues}
        errors={errors}
        onSubmit={handleRuleModalSubmit}
      />

      <RuleDeleteModal
        open={ruleDeleteIndex !== null}
        onClose={() => setRuleDeleteIndex(null)}
        onSubmit={handleRuleDelete}
        confimButtonState={deleteButtonState}
      />
    </DashboardCard>
  );
};
