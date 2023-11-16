import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { DiscoutFormData, Rule } from "@dashboard/discounts/types";
import { saleListUrl } from "@dashboard/discounts/urls";
import { ChannelFragment } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountName } from "../DiscountName";
import { DiscountRules } from "../DiscountRules";

export interface DiscountDetailsPageProps {
  channels: ChannelFragment[];
  disabled: boolean;
  onBack: () => void;
  onSubmit: (data: DiscoutFormData) => void;
  onRuleSubmit: (ruleData: Rule) => void;
  discount: any; // TODO: add type when handle API logic
}

export const DiscountDetailsPage = ({
  channels,
  disabled,
  onBack,
  discount,
  onSubmit,
  onRuleSubmit,
}: DiscountDetailsPageProps) => {
  const methods = useForm<DiscoutFormData>({
    mode: "onBlur",
    values: {
      dates: {
        endDate: discount?.endDate,
        startDate: discount?.startDate,
        endTime: discount?.endTime,
        hasEndDate: !!discount?.endDate,
        startTime: discount?.startTime,
      },
      name: discount?.name,
      description: discount?.description,
      rules: discount?.rules,
    },
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });

  const handleSubmit: SubmitHandler<DiscoutFormData> = data => onSubmit(data);

  const handleRuleSubmit = (index: number) => {
    const formData = methods.getValues();
    onRuleSubmit(formData.rules[index]);
  };

  return (
    <RichTextContext.Provider value={richText}>
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav href={saleListUrl()} title={discount?.name} />
        <DetailPageLayout.Content>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <DiscountName />
              <DiscountDescription />
              <DiscountDatesWithController />
              <DiscountRules
                channels={channels}
                onRuleSubmit={handleRuleSubmit}
              />
            </form>
          </FormProvider>
        </DetailPageLayout.Content>

        <Savebar
          disabled={disabled}
          onCancel={onBack}
          onSubmit={methods.handleSubmit(onSubmit)}
          state={"default"}
        />
      </DetailPageLayout>
    </RichTextContext.Provider>
  );
};
