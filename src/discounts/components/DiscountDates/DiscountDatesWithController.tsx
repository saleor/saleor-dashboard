import { type DiscoutFormData } from "@dashboard/discounts/types";
import { type CommonError } from "@dashboard/utils/errors/common";
import { type ChangeEvent, useEffect, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { DiscountScheduleCard } from "../DiscountScheduleCard/DiscountScheduleCard";
import { discountScheduleMessages } from "../DiscountScheduleCard/messages";
import { type ScheduleDateField } from "./incompleteScheduleFields";

interface DiscountDatesWithControllerProps<ErrorCode> {
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode>>;
}

export const DiscountDatesWithController = <ErrorCode,>({
  disabled,
  errors,
}: DiscountDatesWithControllerProps<ErrorCode>): React.ReactNode => {
  const { formState } = useFormContext<DiscoutFormData>();
  const { field } = useController<DiscoutFormData, "dates">({
    name: "dates",
  });
  const datesErrors = formState.errors?.dates;
  // Enabling "Set end date" fires several field updates in one tick; keep a ref so each
  // merge sees the previous update (RHF field.value does not refresh mid-handler).
  const datesValueRef = useRef(field.value);

  useEffect(
    function syncDatesValueRef() {
      datesValueRef.current = field.value;
    },
    [field.value],
  );

  const update = (changes: Partial<DiscoutFormData["dates"]>): void => {
    const next = {
      ...datesValueRef.current,
      ...changes,
    };

    datesValueRef.current = next;
    field.onChange(next);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    update({ [e.target.name]: e.target.value });
  };

  const handleIncompleteFieldsChange = (incompleteFields: ScheduleDateField[]): void => {
    update({ incompleteFields });
  };

  return (
    <DiscountScheduleCard
      data={field.value}
      disabled={disabled || !!field.disabled}
      errors={errors}
      formErrors={{
        startDate: datesErrors?.startDate,
        startTime: datesErrors?.startTime,
        endDate: datesErrors?.endDate,
        endTime: datesErrors?.endTime,
      }}
      incompleteFields={field.value.incompleteFields ?? []}
      onIncompleteFieldsChange={handleIncompleteFieldsChange}
      onChange={handleChange}
      onBlur={field.onBlur}
      intro={<FormattedMessage {...discountScheduleMessages.promotionIntro} />}
    />
  );
};
