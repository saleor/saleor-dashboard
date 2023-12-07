import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { DiscoutFormData, Rule } from "@dashboard/discounts/types";
import { saleListUrl } from "@dashboard/discounts/urls";
import {
  ChannelFragment,
  PromotionCreateErrorCode,
  PromotionCreateErrorFragment,
} from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import {
  CommonError,
  getCommonFormFieldErrorMessage,
} from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountName } from "../DiscountName";
import { DiscountRules } from "../DiscountRules";
import { RuleDeleteModal } from "../DiscountRules/componenets/RuleDeleteModal/RuleDeleteModal";
import { RuleModal } from "../DiscountRules/componenets/RuleModal/RuleModal";
import { initialFormValues } from "./initialFormValues";

export interface DiscountCreatePageProps {
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
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [ruleEditIndex, setRuleEditIndex] = useState<number | null>(null);
  const [ruleDeleteIndex, setRuleDeleteIndex] = useState<string | null>(null);

  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: initialFormValues,
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });

  const handleSubmit: SubmitHandler<DiscoutFormData> = data => {
    onSubmit({
      ...data,
      rules,
    });
  };

  const handleDeleteRule = () => {
    setRules(rules => {
      rules.splice(Number(ruleDeleteIndex), 1);
      return rules;
    });
    setRuleDeleteIndex(null);
  };

  const formErrors = getFormErrors(["name"], errors);

  return (
    <RichTextContext.Provider value={richText}>
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav
          href={saleListUrl()}
          title={intl.formatMessage({
            id: "FWbv/u",
            defaultMessage: "Create Discount",
            description: "page header",
          })}
        />
        <DetailPageLayout.Content>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
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
                errors={
                  errors as Array<
                    CommonError<CommonError<PromotionCreateErrorCode>> & {
                      index?: number;
                    }
                  >
                }
                channels={channels}
                disabled={disabled}
                onRuleEdit={editIndex => {
                  setRuleEditIndex(Number(editIndex));
                  setShowRuleModal(true);
                }}
                onRuleDelete={(id: string) => {
                  setRuleDeleteIndex(id);
                }}
                onRuleAdd={() => setShowRuleModal(true)}
                rules={rules}
              />
            </form>
          </FormProvider>
        </DetailPageLayout.Content>

        <Savebar
          disabled={disabled}
          onCancel={onBack}
          onSubmit={methods.handleSubmit(handleSubmit)}
          state={submitButtonState}
        />

        <RuleModal
          open={showRuleModal}
          confimButtonState="default"
          onClose={() => {
            setShowRuleModal(false);
            setRuleEditIndex(null);
          }}
          channels={channels}
          initialFormValues={
            ruleEditIndex !== null ? rules[ruleEditIndex] : undefined
          }
          errors={errors.filter(error => error.index === ruleEditIndex)}
          onSubmit={async data => {
            if (ruleEditIndex !== null) {
              setRules(rules => {
                rules[ruleEditIndex] = data;
                return rules;
              });
            } else {
              setRules([...rules, data]);
            }

            setRuleEditIndex(null);
            setShowRuleModal(false);
          }}
        />

        <RuleDeleteModal
          open={ruleDeleteIndex !== null}
          onClose={() => setRuleDeleteIndex(null)}
          onSubmit={handleDeleteRule}
          confimButtonState="default"
        />
      </DetailPageLayout>
    </RichTextContext.Provider>
  );
};
