import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { RuleDTO } from "@dashboard/discounts/dto/dto";
import { DiscoutFormData, Rule } from "@dashboard/discounts/types";
import { saleListUrl } from "@dashboard/discounts/urls";
import {
  ChannelFragment,
  PromotionDetailsFragment,
  PromotionUpdateErrorFragment,
} from "@dashboard/graphql";
import { splitDateTime } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import {
  CommonError,
  getCommonFormFieldErrorMessage,
} from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountName } from "../DiscountName";
import { DiscountRules } from "../DiscountRules";
import { RuleDeleteModal } from "../DiscountRules/componenets/RuleDeleteModal/RuleDeleteModal";
import { RuleModal } from "../DiscountRules/componenets/RuleModal/RuleModal";
import { filterRules } from "./utils";

export interface DiscountDetailsPageProps {
  channels: ChannelFragment[];
  ruleConditionsOptionsDetailsMap: Record<string, string>;
  data: PromotionDetailsFragment | undefined;
  disabled: boolean;
  errors: PromotionUpdateErrorFragment[];
  submitButtonState: ConfirmButtonTransitionState;
  onSubmit: (data: DiscoutFormData) => void;
  onRuleUpdateSubmit: (data: Rule) => Promise<Array<CommonError<any>>>;
  ruleUpdateButtonState: ConfirmButtonTransitionState;
  onRuleCreateSubmit: (data: Rule) => Promise<Array<CommonError<any>>>;
  ruleCreateButtonState: ConfirmButtonTransitionState;
  onRuleDeleteSubmit: (id: string) => void;
  ruleDeleteButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
}

export const DiscountDetailsPage = ({
  channels,
  ruleConditionsOptionsDetailsMap,
  disabled,
  data,
  errors,
  submitButtonState,
  onBack,
  onSubmit,
  onRuleCreateSubmit,
  onRuleUpdateSubmit,
  onRuleDeleteSubmit,
  ruleCreateButtonState,
  ruleUpdateButtonState,
  ruleDeleteButtonState,
}: DiscountDetailsPageProps) => {
  const intl = useIntl();
  const [rules, setRules] = useState<Rule[]>([]);
  const [rulesErrors, setRulesErrors] = useState<Array<CommonError<any>>>([]);

  useEffect(() => {
    if (data?.rules) {
      setRules(
        data.rules.map(rule =>
          RuleDTO.fromAPI(rule, ruleConditionsOptionsDetailsMap),
        ) ?? [],
      );
    }
  }, [data?.rules, ruleConditionsOptionsDetailsMap]);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleEditIndex, setRuleEditIndex] = useState<number | null>(null);
  const [ruleDeleteIndex, setRuleDeleteIndex] = useState<string | null>(null);

  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: {
      dates: {
        startDate: splitDateTime(data?.startDate ?? "").date,
        startTime: splitDateTime(data?.startDate ?? "").time,
        endDate: splitDateTime(data?.endDate ?? "").date,
        endTime: splitDateTime(data?.endDate ?? "").time,
        hasEndDate: !!data?.endDate,
      },
      name: data?.name ?? "",
      description: JSON.stringify(data?.description),
      rules: [],
    },
  });

  const richText = useRichText({
    initial: JSON.stringify(data?.description),
    loading: disabled,
    triggerChange: methods.trigger,
  });

  const handleSubmit: SubmitHandler<DiscoutFormData> = formData => {
    const dirtyRulesIndexes = Object.keys(
      methods.formState.dirtyFields?.rules ?? {},
    );

    onSubmit({
      ...formData,
      rules: filterRules(data?.rules, formData.rules, dirtyRulesIndexes),
    });
  };

  const handleRuleSubmit = async (rule: Rule) => {
    let errors: Array<CommonError<any>> = [];
    if (ruleEditIndex) {
      errors = await onRuleUpdateSubmit(rule);
      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    } else {
      errors = await onRuleCreateSubmit(rule);
      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    }

    if (!errors.length) {
      setShowRuleModal(false);
      setRuleEditIndex(null);
    }
  };

  const handleDeleteRule = () => {
    const ruleId = rules[ruleDeleteIndex].id;
    onRuleDeleteSubmit(ruleId);
    setRuleDeleteIndex(null);
  };

  const formErrors = getFormErrors(["name"], errors);

  return (
    <RichTextContext.Provider value={richText}>
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav href={saleListUrl()} title={data?.name} />
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
                errors={rulesErrors}
                rules={rules}
                onRuleEdit={editIndex => {
                  setRuleEditIndex(Number(editIndex));
                  setShowRuleModal(true);
                }}
                onRuleDelete={(id: string) => {
                  setRuleDeleteIndex(id);
                }}
                onRuleAdd={() => setShowRuleModal(true)}
                channels={channels}
                disabled={disabled}
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

        {showRuleModal && (
          <RuleModal
            confimButtonState={
              ruleEditIndex !== null
                ? ruleUpdateButtonState
                : ruleCreateButtonState
            }
            onClose={() => {
              setShowRuleModal(false);
              setRuleEditIndex(null);
            }}
            channels={channels}
            initialFormValues={
              ruleEditIndex !== null ? rules[ruleEditIndex] : undefined
            }
            errors={rulesErrors}
            onSubmit={handleRuleSubmit}
          />
        )}

        {ruleDeleteIndex !== null && (
          <RuleDeleteModal
            onClose={() => setRuleDeleteIndex(null)}
            onSubmit={handleDeleteRule}
            confimButtonState={ruleDeleteButtonState}
          />
        )}
      </DetailPageLayout>
    </RichTextContext.Provider>
  );
};
