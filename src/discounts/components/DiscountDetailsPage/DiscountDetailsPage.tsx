import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { discountListUrl } from "@dashboard/discounts/discountsUrls";
import { Rule } from "@dashboard/discounts/models";
import { DiscoutFormData } from "@dashboard/discounts/types";
import {
  ChannelFragment,
  PromotionDetailsFragment,
  PromotionRuleCreateErrorFragment,
  PromotionRuleUpdateErrorFragment,
  PromotionUpdateErrorFragment,
} from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import {
  CommonError,
  getCommonFormFieldErrorMessage,
} from "@dashboard/utils/errors/common";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountDetailsForm } from "../DiscountDetailsForm";
import { DiscountName } from "../DiscountName";
import { DiscountRules } from "../DiscountRules";

export interface DiscountDetailsPageProps {
  channels: ChannelFragment[];
  ruleConditionsOptionsDetailsMap: Record<string, string>;
  ruleConditionsOptionsDetailsLoading: boolean;
  data: PromotionDetailsFragment | undefined | null;
  disabled: boolean;
  errors: PromotionUpdateErrorFragment[];
  submitButtonState: ConfirmButtonTransitionState;
  onSubmit: (data: DiscoutFormData) => void;
  onDelete: () => void;
  onRuleUpdateSubmit: (
    data: Rule,
  ) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  ruleUpdateButtonState: ConfirmButtonTransitionState;
  onRuleCreateSubmit: (
    data: Rule,
  ) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  ruleCreateButtonState: ConfirmButtonTransitionState;
  onRuleDeleteSubmit: (id: string) => void;
  ruleDeleteButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
}

export const DiscountDetailsPage = ({
  channels,
  ruleConditionsOptionsDetailsMap,
  ruleConditionsOptionsDetailsLoading,
  disabled,
  data,
  errors,
  submitButtonState,
  onBack,
  onSubmit,
  onDelete,
  onRuleCreateSubmit,
  onRuleUpdateSubmit,
  onRuleDeleteSubmit,
  ruleCreateButtonState,
  ruleUpdateButtonState,
  ruleDeleteButtonState,
}: DiscountDetailsPageProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={discountListUrl()} title={data?.name} />
      <DetailPageLayout.Content>
        <DiscountDetailsForm
          data={data}
          disabled={disabled}
          onSubmit={onSubmit}
          ruleConditionsOptionsDetailsMap={ruleConditionsOptionsDetailsMap}
          onRuleCreateSubmit={onRuleCreateSubmit}
          onRuleDeleteSubmit={onRuleDeleteSubmit}
          onRuleUpdateSubmit={onRuleUpdateSubmit}
        >
          {({ rulesErrors, rules, onDeleteRule, onRuleSubmit, onSubmit }) => (
            <>
              <DiscountName
                error={getCommonFormFieldErrorMessage(formErrors.name, intl)}
                disabled={disabled}
              />

              <DiscountDescription disabled={disabled} />

              <DiscountDatesWithController
                errors={errors}
                disabled={disabled}
              />

              <DiscountRules
                errors={rulesErrors}
                rules={rules}
                loading={ruleConditionsOptionsDetailsLoading}
                getRuleConfirmButtonState={ruleEditIndex =>
                  ruleEditIndex !== null
                    ? ruleUpdateButtonState
                    : ruleCreateButtonState
                }
                deleteButtonState={ruleDeleteButtonState}
                onRuleDelete={onDeleteRule}
                onRuleSubmit={onRuleSubmit}
                channels={channels}
                disabled={disabled}
              />

              <Savebar
                disabled={disabled}
                onCancel={onBack}
                onSubmit={onSubmit}
                onDelete={onDelete}
                state={submitButtonState}
              />
            </>
          )}
        </DiscountDetailsForm>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
