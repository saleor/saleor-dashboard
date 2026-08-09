import { type Rule } from "@dashboard/discounts/models";
import { type DiscoutFormData } from "@dashboard/discounts/types";
import { type PromotionTypeEnum } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useMemo } from "react";
import { FormProvider, type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  buildPromotionSaveComposition,
  EMPTY_PROMOTION_SAVE_COMPOSITION,
  hasPromotionSaveComposition,
  type PromotionSaveComposition,
} from "../DiscountDetailsForm/promotionSaveComposition";
import { useDiscountFormExit } from "../DiscountDetailsForm/useDiscountFormExit";
import { useRulesHandlers } from "./hooks/useRulesHandlers";
import { initialFormValues } from "./initialFormValues";
import { getValidationSchema } from "./validationSchema";

interface CreateFormRenderProps {
  rules: Rule[];
  discountType: PromotionTypeEnum;
  onDeleteRule: (ruleDeleteIndex: number) => void;
  onRuleSubmit: (data: Rule, ruleEditIndex: number | null) => void;
  submitHandler: () => void;
  saveComposition: PromotionSaveComposition;
  hasUnsavedChanges: boolean;
}

interface DiscountCreateFormProps {
  children: (renderProps: CreateFormRenderProps) => ReactNode;
  onSubmit: (data: DiscoutFormData) => void;
}

export const DiscountCreateForm = ({ children, onSubmit }: DiscountCreateFormProps) => {
  const intl = useIntl();
  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: initialFormValues,
    resolver: zodResolver(getValidationSchema(intl)),
  });
  const currentValues = useWatch({ control: methods.control });
  const discountType = (currentValues?.type ?? initialFormValues.type) as PromotionTypeEnum;
  const { rules, onDeleteRule, onRuleSubmit } = useRulesHandlers(discountType);
  const saveComposition = useMemo(() => {
    if (!currentValues) {
      return EMPTY_PROMOTION_SAVE_COMPOSITION;
    }

    return buildPromotionSaveComposition(currentValues as DiscoutFormData, initialFormValues);
  }, [currentValues]);
  // Draft rules only persist when the promotion is created — treat them as unsaved.
  const hasUnsavedChanges = hasPromotionSaveComposition(saveComposition) || rules.length > 0;

  useDiscountFormExit({
    enabled: true,
    isDirty: hasUnsavedChanges,
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
  const submitHandlerWithValidation = methods.handleSubmit(handleSubmit);

  return (
    <RichTextContext.Provider value={richText}>
      <FormProvider {...methods}>
        <form onSubmit={submitHandlerWithValidation}>
          {children({
            onDeleteRule,
            onRuleSubmit,
            discountType,
            submitHandler: submitHandlerWithValidation,
            rules,
            saveComposition,
            hasUnsavedChanges,
          })}
        </form>
      </FormProvider>
    </RichTextContext.Provider>
  );
};
