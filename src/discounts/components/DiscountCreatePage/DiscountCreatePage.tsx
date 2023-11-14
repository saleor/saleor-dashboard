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
import { Inputs } from "./types";

interface DiscountCreateProps {
  channels: ChannelFragment[];
  disabled: boolean;
  onBack: () => void;
}

export const DiscountCreatePage = ({
  disabled,
  onBack,
}: DiscountCreateProps) => {
  const intl = useIntl();

  const methods = useForm<Inputs>({
    mode: "onBlur",
    values: initialFormValues,
  });

  const richText = useRichText({
    initial: "",
    loading: false,
    triggerChange: methods.trigger,
  });

  console.log(methods.watch());

  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

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
              <DiscountRules />
            </form>
          </FormProvider>
        </DetailPageLayout.Content>

        <Savebar
          disabled={disabled}
          onCancel={onBack}
          onSubmit={() => {}}
          state={"default"}
        />
      </DetailPageLayout>
    </RichTextContext.Provider>
  );
};
