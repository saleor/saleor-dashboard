import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { saleListUrl } from "@dashboard/discounts/urls";
import {
  ChannelFragment,
  PromotionCreateErrorFragment,
} from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDescription } from "../DiscountDescription";
import { DiscountName } from "../DiscountName";
import { DiscountRules } from "../DiscountRules";
import { initialFormValues } from "./initialFormValues";

export interface DiscountCreatePageProps {
  channels: ChannelFragment[];
  disabled: boolean;
  errors: PromotionCreateErrorFragment[];
  submitButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: DiscoutFormData) => void;
}

export const DiscountCreatePage = ({
  channels,
  disabled,
  errors,
  submitButtonState,
  onBack,
  onSubmit,
}: DiscountCreatePageProps) => {
  const intl = useIntl();

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
    onSubmit(data);
  };

  const formErrors = getFormErrors(["name"], errors);

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
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <DiscountName
                error={getCommonFormFieldErrorMessage(formErrors.name, intl)}
                disabled={disabled}
              />
              <DiscountDescription disabled={disabled} />
              <DiscountDatesWithController
                errors={errors}
                disabled={disabled}
              />
              <DiscountRules
                errors={errors}
                channels={channels}
                disabled={disabled}
              />
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
