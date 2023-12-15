import { Rule } from "@dashboard/discounts/models";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { ReactNode, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

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
  const [rules, setRules] = useState<Rule[]>([]);

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

  const onDeleteRule = (ruleDeleteIndex: string) => {
    setRules(rules =>
      rules.filter((_, index) => index !== Number(ruleDeleteIndex)),
    );
  };

  const onRuleSubmit = async (data: Rule, ruleEditIndex: string | null) => {
    if (ruleEditIndex !== null) {
      setRules(rules => {
        rules[ruleEditIndex] = data;
        return rules;
      });
    } else {
      setRules([...rules, data]);
    }
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
