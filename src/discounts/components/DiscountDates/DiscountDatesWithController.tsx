import { DiscoutFormData } from "@dashboard/discounts/types";
import { CommonError } from "@dashboard/utils/errors/common";
import React, { ChangeEvent } from "react";
import { useController, useFormContext } from "react-hook-form";

import DiscountDates from "./DiscountDates";

interface DiscountDatesWithControllerProps<ErrorCode> {
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode>>;
}

export const DiscountDatesWithController = <ErrorCode,>({
  disabled,
  errors,
}: DiscountDatesWithControllerProps<ErrorCode>) => {
  const { formState } = useFormContext<DiscoutFormData>();
  const { field } = useController<DiscoutFormData, "dates">({
    name: "dates",
  });
  const startDateError = formState.errors?.dates?.startDate;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange({
      ...field.value,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DiscountDates
      data={field.value}
      disabled={disabled || !!field.disabled}
      errors={errors}
      formErrors={{
        startDate: startDateError,
      }}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
};
