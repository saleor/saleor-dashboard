import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { discountListUrl } from "@dashboard/discounts/discountsUrls";
import { DiscoutFormData } from "@dashboard/discounts/types";
import {
  ChannelFragment,
  PromotionCreateErrorCode,
  PromotionCreateErrorFragment,
} from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountCreateForm } from "../DiscountCreateForm";
import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountGeneralInfo } from "../DiscountGeneralInfo";
import { DiscountRules, DiscountRulesErrors } from "../DiscountRules";

interface DiscountCreatePageProps {
  channels: ChannelFragment[];
  disabled: boolean;
  errors: PromotionCreateErrorFragment[];
  submitButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: DiscoutFormData) => void;
}

export const DiscountCreatePage = ({
  channels,
  disabled,
  errors,
  submitButtonState,
  onBack,
  onSubmit,
}: DiscountCreatePageProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={discountListUrl()}
        title={intl.formatMessage({
          id: "FWbv/u",
          defaultMessage: "Create Discount",
          description: "page header",
        })}
      />
      <DetailPageLayout.Content>
        <DiscountCreateForm onSubmit={onSubmit}>
          {({ rules, discountType, onDeleteRule, onRuleSubmit, submitHandler }) => (
            <>
              <DiscountGeneralInfo
                error={getCommonFormFieldErrorMessage(formErrors.name, intl)}
                disabled={disabled}
                typeDisabled={false}
              />

              <DiscountDescription disabled={disabled} />

              <DiscountDatesWithController errors={errors} disabled={disabled} />

              <DiscountRules
                promotionId={null}
                discountType={discountType}
                errors={errors as DiscountRulesErrors<PromotionCreateErrorCode>}
                channels={channels}
                disabled={disabled}
                rules={rules}
                onRuleDelete={onDeleteRule}
                onRuleSubmit={onRuleSubmit}
                getRuleConfirmButtonState={() => "default"}
                deleteButtonState="default"
              />

              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={onBack} />
                <Savebar.ConfirmButton
                  transitionState={submitButtonState}
                  onClick={submitHandler}
                  disabled={disabled}
                />
              </Savebar>
            </>
          )}
        </DiscountCreateForm>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
