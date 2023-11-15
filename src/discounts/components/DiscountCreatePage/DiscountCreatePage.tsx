import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { saleListUrl } from "@dashboard/discounts/urls";
import { ChannelFragment } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { DiscountRules } from "../DiscountRules";
import { DiscountDates } from "./components/DiscountDates/DiscountDates";
import { DiscountDescription } from "./components/DiscountDescription";
import { DiscountName } from "./components/DiscountName";
import { initialFormValues } from "./const";
import { CreateDiscoutFormData } from "./types";

interface DiscountCreateProps {
  channels: ChannelFragment[];
  disabled: boolean;
  onBack: () => void;
}

export const DiscountCreatePage = ({
  disabled,
  onBack,
  channels,
}: DiscountCreateProps) => {
  const intl = useIntl();

  const methods = useForm<CreateDiscoutFormData>({
    mode: "onBlur",
    values: initialFormValues,
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });

  const onSubmit: SubmitHandler<CreateDiscoutFormData> = data =>
    console.log(data);

  return (
    <RichTextContext.Provider value={richText}>
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav
          href={saleListUrl()}
          title={intl.formatMessage({
            id: "FWbv/u",
            defaultMessage: "Create Discount",
            description: "page header",
          })}
        />
        <DetailPageLayout.Content>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <DiscountName />
              <DiscountDescription />
              <DiscountDates />
              <DiscountRules channels={channels} />
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
