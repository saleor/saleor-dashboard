import { Rule } from "@dashboard/discounts/models";
import { DiscountFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { useRulesHandlers } from "./hooks/useRulesHandlers";
import { initialFormValues } from "./initialFormValues";
import { getValidationSchema } from "./validationSchema";

interface CreateFormRenderProps {
  rules: Rule[];
  discountType: PromotionTypeEnum;
  onDeleteRule: (ruleDeleteIndex: number) => void;
  onRuleSubmit: (data: Rule, ruleEditIndex: number | null) => void;
  submitHandler: () => void;
}

interface DiscountCreateFormProps {
  children: (renderProps: CreateFormRenderProps) => ReactNode;
  onSubmit: (data: DiscountFormData) => void;
}

export const DiscountCreateForm = ({ children, onSubmit }: DiscountCreateFormProps) => {
  const intl = useIntl();
  const methods = useForm<DiscountFormData>({
    mode: "onBlur",
    values: initialFormValues,
    resolver: zodResolver(getValidationSchema(intl)),
  });
  const discountType = methods.watch("type");
  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });
  const { rules, onDeleteRule, onRuleSubmit } = useRulesHandlers(discountType);
  const handleSubmit: SubmitHandler<DiscountFormData> = data => {
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
          })}
        </form>
      </FormProvider>
    </RichTextContext.Provider>
  );
};
