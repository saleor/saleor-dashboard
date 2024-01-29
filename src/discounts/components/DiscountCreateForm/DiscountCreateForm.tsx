import { Rule } from "@dashboard/discounts/models";
import { DiscoutFormData } from "@dashboard/discounts/types";
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
  onDeleteRule: (ruleDeleteIndex: number) => void;
  onRuleSubmit: (data: Rule, ruleEditIndex: number | null) => void;
  submitHandler: () => void;
}

interface DiscountCreateFormProps {
  children: (renderProps: CreateFormRenderProps) => ReactNode;
  onSubmit: (data: DiscoutFormData) => void;
}

export const DiscountCreateForm = ({
  children,
  onSubmit,
}: DiscountCreateFormProps) => {
  const intl = useIntl();

  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: initialFormValues,
    resolver: zodResolver(getValidationSchema(intl)),
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });

  const { rules, onDeleteRule, onRuleSubmit } = useRulesHandlers("catalog");

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
            submitHandler: submitHandlerWithValidation,
            rules,
          })}
        </form>
      </FormProvider>
    </RichTextContext.Provider>
  );
};
