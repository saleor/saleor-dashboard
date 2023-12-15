import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Rule } from "@dashboard/discounts/models";
import { ChannelFragment } from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { Box } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { RuleDeleteModal } from "./componenets/RuleDeleteModal/RuleDeleteModal";
import { RuleFormModal } from "./componenets/RuleFormModal";
import { RulesList } from "./componenets/RulesList";
import { messages } from "./messages";

export type DiscountRulesErrors<ErrorCode> = Array<
  CommonError<ErrorCode> & { index?: number }
>;

interface DiscountRulesProps<ErrorCode> {
  disabled?: boolean;
  channels: ChannelFragment[];
  rules: Rule[];
  errors: Array<CommonError<ErrorCode>>;
  loading?: boolean;
  deleteButtonState?: ConfirmButtonTransitionState;
  getRuleConfirmButtonState: (
    ruleEditIndex: string | null,
  ) => ConfirmButtonTransitionState;
  onRuleSubmit: (data: Rule, ruleIndex: string) => void;
  onRuleDelete: (ruleIndex: string) => void;
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

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleEditIndex, setRuleEditIndex] = useState<string | null>(null);
  const [ruleDeleteIndex, setRuleDeleteIndex] = useState<string | null>(null);

  return (
    <DashboardCard marginBottom={20}>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton
            disabled={disabled}
            onCatalogClick={() => setShowRuleModal(true)}
          />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <RulesList
          loading={loading}
          rules={rules}
          onRuleEdit={editIndex => {
            setRuleEditIndex(editIndex);
            setShowRuleModal(true);
          }}
          onRuleDelete={(id: string) => {
            setRuleDeleteIndex(id);
          }}
          channels={channels}
          errors={errors}
        />
      </DashboardCard.Content>

      <RuleFormModal
        open={showRuleModal}
        confimButtonState={getRuleConfirmButtonState(ruleEditIndex)}
        onClose={() => {
          setShowRuleModal(false);
          setRuleEditIndex(null);
        }}
        channels={channels}
        initialFormValues={
          ruleEditIndex !== null ? rules[ruleEditIndex] : undefined
        }
        errors={errors}
        onSubmit={data => {
          onRuleSubmit(data, ruleEditIndex);
          setShowRuleModal(false);
          setRuleEditIndex(null);
        }}
      />

      <RuleDeleteModal
        open={ruleDeleteIndex !== null}
        onClose={() => setRuleDeleteIndex(null)}
        onSubmit={() => {
          onRuleDelete(ruleDeleteIndex);
          setRuleDeleteIndex(null);
        }}
        confimButtonState={deleteButtonState}
      />
    </DashboardCard>
  );
};
