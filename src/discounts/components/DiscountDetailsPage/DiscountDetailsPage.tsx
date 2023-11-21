import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { Condition, DiscoutFormData, Rule } from "@dashboard/discounts/types";
import { saleListUrl } from "@dashboard/discounts/urls";
import { ChannelFragment, PromotionDetailsFragment } from "@dashboard/graphql";
import { splitDateTime } from "@dashboard/misc";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Option } from "@saleor/macaw-ui-next";
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
  data: PromotionDetailsFragment;
}

export const DiscountDetailsPage = ({
  channels,
  disabled,
  onBack,
  data,
  onSubmit,
  onRuleSubmit,
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
      rules: data?.rules.map<Rule>(rule => {
        return {
          channels: rule.channels.map<Option>(chan => ({
            label: chan.name,
            value: chan.id,
          })),
          name: rule.name,
          description: JSON.stringify(rule.description),
          rewardValue: rule.rewardValue,
          rewardValueType: rule.rewardValueType,
          conditions: rule.cataloguePredicate.OR.reduce((acc, condition) => {
            if (condition.productPredicate) {
              acc.push({
                type: "products",
                condition: "is",
                values: condition.productPredicate.ids.map(id => ({
                  label: id,
                  value: id,
                })),
              } as Condition);
            }

            if (condition.categoryPredicate) {
              acc.push({
                type: "categories",
                condition: "is",
                values: condition.categoryPredicate.ids.map(id => ({
                  label: id,
                  value: id,
                })),
              });
            }

            if (condition.collectionPredicate) {
              acc.push({
                type: "collections",
                condition: "is",
                values: condition.collectionPredicate.ids.map(id => ({
                  label: id,
                  value: id,
                })),
              });
            }
            return acc;
          }, []),
        };
      }),
    },
  });

  const richText = useRichText({
    initial: JSON.stringify(data?.description),
    loading: disabled,
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
        <TopNav href={saleListUrl()} title={data?.name} />
        <DetailPageLayout.Content>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <DiscountName />
              <DiscountDescription />
              <DiscountDatesWithController />
              <DiscountRules
                fetchOptions={(() => {}) as any}
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
