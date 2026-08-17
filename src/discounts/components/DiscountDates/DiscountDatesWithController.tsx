import { type DiscoutFormData } from "@dashboard/discounts/types";
import { type CommonError } from "@dashboard/utils/errors/common";
import { type ChangeEvent, useEffect, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { DiscountScheduleCard } from "../DiscountScheduleCard/DiscountScheduleCard";
import { discountScheduleMessages } from "../DiscountScheduleCard/messages";

interface DiscountDatesWithControllerProps<ErrorCode> {
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode>>;
}

export const DiscountDatesWithController = <ErrorCode,>({
  disabled,
  errors,
}: DiscountDatesWithControllerProps<ErrorCode>): JSX.Element => {
  const { formState } = useFormContext<DiscoutFormData>();
  const { field } = useController<DiscoutFormData, "dates">({
    name: "dates",
  });
  const startDateError = formState.errors?.dates?.startDate;
  // Enabling "Set end date" fires several field updates in one tick; keep a ref so each
  // merge sees the previous update (RHF field.value does not refresh mid-handler).
  const datesValueRef = useRef(field.value);

  useEffect(
    function syncDatesValueRef() {
      datesValueRef.current = field.value;
    },
    [field.value],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const next = {
      ...datesValueRef.current,
      [e.target.name]: e.target.value,
    };

    datesValueRef.current = next;
    field.onChange(next);
  };

  return (
    <DiscountScheduleCard
      data={field.value}
      disabled={disabled || !!field.disabled}
      errors={errors}
      formErrors={{
        startDate: startDateError,
      }}
      onChange={handleChange}
      onBlur={field.onBlur}
      intro={<FormattedMessage {...discountScheduleMessages.promotionIntro} />}
    />
  );
};
