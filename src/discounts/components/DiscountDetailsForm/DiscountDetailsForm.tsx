import { Rule } from "@dashboard/discounts/models";
import { DiscoutFormData } from "@dashboard/discounts/types";
import {
  PromotionDetailsFragment,
  PromotionRuleCreateErrorFragment,
  PromotionRuleUpdateErrorFragment,
} from "@dashboard/graphql";
import { splitDateTime } from "@dashboard/misc";
import { CommonError } from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { ReactNode, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { filterRules } from "./utils";

interface DiscountDetailsFormRenderProps {
  rulesErrors: Array<CommonError<any>>;
  rules: Rule[];
  onSubmit: () => void;
  onRuleSubmit: (rule: Rule, ruleEditIndex: string | null) => Promise<void>;
  onDeleteRule: (ruleDeleteIndex: string) => Promise<void>;
}

interface DiscountDetailsFormProps {
  children: (renderProps: DiscountDetailsFormRenderProps) => ReactNode;
  disabled: boolean;
  data: PromotionDetailsFragment | undefined | null;
  onSubmit: (data: DiscoutFormData) => void;
  ruleConditionsOptionsDetailsMap: Record<string, string>;
  onRuleUpdateSubmit: (
    data: Rule,
  ) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  onRuleCreateSubmit: (
    data: Rule,
  ) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  onRuleDeleteSubmit: (id: string) => void;
}

export const DiscountDetailsForm = ({
  children,
  data,
  disabled,
  onSubmit,
  onRuleCreateSubmit,
  onRuleDeleteSubmit,
  onRuleUpdateSubmit,
  ruleConditionsOptionsDetailsMap,
}: DiscountDetailsFormProps) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [rulesErrors, setRulesErrors] = useState<Array<CommonError<any>>>([]);

  useEffect(() => {
    if (data?.rules) {
      setRules(
        data.rules.map(rule =>
          Rule.fromAPI(rule, ruleConditionsOptionsDetailsMap),
        ) ?? [],
      );
    }
  }, [data?.rules, ruleConditionsOptionsDetailsMap]);

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
      rules: filterRules(data?.rules ?? [], formData.rules, dirtyRulesIndexes),
    });
  };

  const onRuleSubmit = async (rule: Rule, ruleEditIndex: string | null) => {
    let errors: Array<
      CommonError<
        PromotionRuleUpdateErrorFragment | PromotionRuleCreateErrorFragment
      >
    > = [];

    if (ruleEditIndex !== null) {
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
  };

  const onDeleteRule = async (ruleDeleteIndex: string) => {
    if (ruleDeleteIndex === null) {
      return;
    }

    const ruleId = rules[Number(ruleDeleteIndex)].id;
    if (!ruleId) {
      return;
    }

    await onRuleDeleteSubmit(ruleId);
  };

  return (
    <RichTextContext.Provider value={richText}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          {children({
            rulesErrors,
            rules,
            onSubmit: methods.handleSubmit(handleSubmit),
            onRuleSubmit,
            onDeleteRule,
          })}
        </form>
      </FormProvider>
    </RichTextContext.Provider>
  );
};
