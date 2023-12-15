import { Rule } from "@dashboard/discounts/models";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { useRulesHandlers } from "./hooks/useRulesHandlers";
import { initialFormValues } from "./initialFormValues";

interface CreateFormRenderProps {
  rules: Rule[];
  onDeleteRule: (ruleDeleteIndex: string) => void;
  onRuleSubmit: (data: Rule, ruleEditIndex: string | null) => void;
  onSubmit: () => void;
}

interface DiscountCreateFormProps {
  children: (renderProps: CreateFormRenderProps) => ReactNode;
  onSubmit: (data: DiscoutFormData) => void;
}

export const DiscountCreateForm = ({
  children,
  onSubmit,
}: DiscountCreateFormProps) => {
  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: initialFormValues,
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });

  const { rules, onDeleteRule, onRuleSubmit } = useRulesHandlers();

  const handleSubmit: SubmitHandler<DiscoutFormData> = data => {
    onSubmit({
      ...data,
      rules,
    });
  };

  return (
    <RichTextContext.Provider value={richText}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          {children({
            onDeleteRule,
            onRuleSubmit,
            onSubmit: methods.handleSubmit(handleSubmit),
            rules,
          })}
        </form>
      </FormProvider>
    </RichTextContext.Provider>
  );
};
