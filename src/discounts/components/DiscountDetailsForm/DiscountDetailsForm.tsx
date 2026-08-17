import { type Rule } from "@dashboard/discounts/models";
import { type DiscoutFormData } from "@dashboard/discounts/types";
import { useLabelMapsContext } from "@dashboard/discounts/views/DiscountDetails/context/context";
import {
  type PromotionDetailsFragment,
  type PromotionRuleCreateErrorFragment,
  type PromotionRuleUpdateErrorFragment,
  PromotionTypeEnum,
} from "@dashboard/graphql";
import { splitDateTime } from "@dashboard/misc";
import { type CommonError } from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidationSchema } from "../DiscountCreateForm/validationSchema";
import { useRulesHandlers } from "./hooks/useRulesHandlers";
import {
  buildPromotionSaveComposition,
  EMPTY_PROMOTION_SAVE_COMPOSITION,
  hasPromotionSaveComposition,
  type PromotionSaveComposition,
} from "./promotionSaveComposition";
import { useDiscountFormExit } from "./useDiscountFormExit";

interface DiscountDetailsFormRenderProps {
  rulesErrors: Array<CommonError<any>>;
  rules: Rule[];
  discountType: PromotionTypeEnum;
  onSubmit: () => void;
  onRuleSubmit: (rule: Rule, ruleEditIndex: number | null) => Promise<void>;
  onDeleteRule: (ruleDeleteIndex: number) => Promise<boolean>;
  saveComposition: PromotionSaveComposition;
}

interface DiscountDetailsFormProps {
  children: (renderProps: DiscountDetailsFormRenderProps) => ReactNode;
  disabled: boolean;
  data: PromotionDetailsFragment | undefined | null;
  onSubmit: (data: DiscoutFormData) => void;
  onRuleUpdateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  onRuleCreateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  onRuleDeleteSubmit: (id: string) => Promise<boolean>;
}

const toFormData = (data: PromotionDetailsFragment | undefined | null): DiscoutFormData => ({
  type: data?.type ?? PromotionTypeEnum.CATALOGUE,
  dates: {
    startDate: splitDateTime(data?.startDate ?? "").date,
    startTime: splitDateTime(data?.startDate ?? "").time,
    endDate: splitDateTime(data?.endDate ?? "").date,
    endTime: splitDateTime(data?.endDate ?? "").time,
    hasEndDate: !!data?.endDate,
  },
  name: data?.name ?? "",
  description: data?.description ? JSON.stringify(data.description) : "",
  rules: [],
});

export const DiscountDetailsForm = ({
  children,
  data,
  disabled,
  onSubmit,
  onRuleCreateSubmit,
  onRuleDeleteSubmit,
  onRuleUpdateSubmit,
}: DiscountDetailsFormProps) => {
  const intl = useIntl();
  const baseline = useMemo(() => toFormData(data), [data]);
  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: baseline,
    resolver: zodResolver(getValidationSchema(intl)),
  });
  const currentValues = useWatch({ control: methods.control });
  const discountType = (currentValues?.type ?? baseline.type) as PromotionTypeEnum;
  const saveComposition = useMemo(() => {
    if (!data || !currentValues) {
      return EMPTY_PROMOTION_SAVE_COMPOSITION;
    }

    return buildPromotionSaveComposition(currentValues as DiscoutFormData, baseline);
  }, [baseline, currentValues, data]);
  const hasUnsavedChanges = hasPromotionSaveComposition(saveComposition);

  useDiscountFormExit({
    // Stay registered while the entity exists — do not unregister during Save loading.
    enabled: !!data,
    isDirty: hasUnsavedChanges,
  });

  const richText = useRichText({
    initial: JSON.stringify(data?.description),
    loading: disabled,
    triggerChange: methods.trigger,
  });
  const handleSubmit = methods.handleSubmit(onSubmit);
  const { ruleConditionsValues, gifts } = useLabelMapsContext();
  const { onDeleteRule, onRuleSubmit, rules, rulesErrors } = useRulesHandlers({
    data,
    onRuleCreateSubmit,
    onRuleDeleteSubmit,
    onRuleUpdateSubmit,
    ruleConditionsOptionsDetailsMap: ruleConditionsValues.labels,
    giftsOptionsDetailsMap: gifts.labels,
  });

  return (
    <RichTextContext.Provider value={richText}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} data-test-id="discount-form">
          {children({
            rulesErrors,
            rules,
            discountType,
            onSubmit: handleSubmit,
            onRuleSubmit,
            onDeleteRule,
            saveComposition,
          })}
        </form>
      </FormProvider>
    </RichTextContext.Provider>
  );
};
