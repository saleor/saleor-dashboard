import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
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
import { CommonError, getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountDetailsForm } from "../DiscountDetailsForm";
import { DiscountGeneralInfo } from "../DiscountGeneralInfo";
import { DiscountRules } from "../DiscountRules";
import { DiscountSavebar } from "../DiscountSavebar";

export interface DiscountDetailsPageProps {
  channels: ChannelFragment[];
  data: PromotionDetailsFragment | undefined | null;
  disabled: boolean;
  errors: PromotionUpdateErrorFragment[];
  submitButtonState: ConfirmButtonTransitionState;
  onSubmit: (data: DiscoutFormData) => void;
  onDelete: () => void;
  onRuleUpdateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  ruleUpdateButtonState: ConfirmButtonTransitionState;
  onRuleCreateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  ruleCreateButtonState: ConfirmButtonTransitionState;
  onRuleDeleteSubmit: (id: string) => void;
  ruleDeleteButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
  backLinkHref: string;
}

export const DiscountDetailsPage = ({
  channels,
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
  backLinkHref,
}: DiscountDetailsPageProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={backLinkHref} title={data?.name} />
      <DetailPageLayout.Content>
        <DiscountDetailsForm
          data={data}
          disabled={disabled}
          onSubmit={onSubmit}
          onRuleCreateSubmit={onRuleCreateSubmit}
          onRuleDeleteSubmit={onRuleDeleteSubmit}
          onRuleUpdateSubmit={onRuleUpdateSubmit}
        >
          {({ rulesErrors, rules, discountType, onDeleteRule, onRuleSubmit, onSubmit }) => (
            <>
              <DiscountGeneralInfo
                error={getCommonFormFieldErrorMessage(formErrors.name, intl)}
                disabled={disabled}
                typeDisabled={true}
              />

              <DiscountDescription disabled={disabled} />

              <DiscountDatesWithController errors={errors} disabled={disabled} />

              <DiscountRules
                promotionId={data?.id ?? null}
                discountType={discountType}
                errors={rulesErrors}
                rules={rules}
                getRuleConfirmButtonState={ruleEditIndex =>
                  ruleEditIndex !== null ? ruleUpdateButtonState : ruleCreateButtonState
                }
                deleteButtonState={ruleDeleteButtonState}
                onRuleDelete={onDeleteRule}
                onRuleSubmit={onRuleSubmit}
                channels={channels}
                disabled={disabled}
              />

              <DiscountSavebar
                disabled={disabled}
                onCancel={onBack}
                onSubmit={onSubmit}
                onDelete={onDelete}
                submitButtonState={submitButtonState}
              />
            </>
          )}
        </DiscountDetailsForm>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
