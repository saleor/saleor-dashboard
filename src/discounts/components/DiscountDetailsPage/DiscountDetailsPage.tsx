import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { RuleDTO } from "@dashboard/discounts/dto/dto";
import { ConditionType, DiscoutFormData } from "@dashboard/discounts/types";
import { saleListUrl } from "@dashboard/discounts/urls";
import { FetchOptions } from "@dashboard/discounts/views/DiscountCreate/hooks/useOptionsFetch";
import { ChannelFragment, PromotionDetailsFragment } from "@dashboard/graphql";
import { splitDateTime } from "@dashboard/misc";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountName } from "../DiscountName";
import { DiscountRules } from "../DiscountRules";
import { filterRules } from "./utils";

export interface DiscountDetailsPageProps {
  channels: ChannelFragment[];
  disabled: boolean;
  onBack: () => void;
  onSubmit: (data: DiscoutFormData) => void;
  fetchOptions: (type: ConditionType) => FetchOptions;
  submitButtonState: ConfirmButtonTransitionState;
  data: PromotionDetailsFragment;
  conditionLabels: Record<string, string>;
}

export const DiscountDetailsPage = ({
  channels,
  disabled,
  onBack,
  data,
  conditionLabels,
  submitButtonState,
  onSubmit,
  fetchOptions,
}: DiscountDetailsPageProps) => {
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
      rules: data?.rules.map(rule => RuleDTO.fromAPI(rule, conditionLabels)),
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

  return (
    <RichTextContext.Provider value={richText}>
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav href={saleListUrl()} title={data?.name} />
        <DetailPageLayout.Content>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <DiscountName />
              <DiscountDescription />
              <DiscountDatesWithController />
              <DiscountRules fetchOptions={fetchOptions} channels={channels} />
            </form>
          </FormProvider>
        </DetailPageLayout.Content>

        <Savebar
          disabled={disabled}
          onCancel={onBack}
          onSubmit={methods.handleSubmit(handleSubmit)}
          state={submitButtonState}
        />
      </DetailPageLayout>
    </RichTextContext.Provider>
  );
};
