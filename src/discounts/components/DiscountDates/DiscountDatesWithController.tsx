import { DiscoutFormData } from "@dashboard/discounts/types";
import { CommonError } from "@dashboard/utils/errors/common";
import React, { ChangeEvent } from "react";
import { useController } from "react-hook-form";

import DiscountDates from "./DiscountDates";

interface DiscountDatesWithControllerProps<ErrorCode> {
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode>>;
}

export const DiscountDatesWithController = <ErrorCode,>({
  disabled,
  errors,
}: DiscountDatesWithControllerProps<ErrorCode>) => {
  const { field } = useController<DiscoutFormData, "dates">({
    name: "dates",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange({
      ...field.value,
      [e.target.name]: getInputChangeValue(e),
    });
  };

  return (
    <DiscountDates
      data={field.value}
      disabled={disabled || !!field.disabled}
      errors={errors}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
};

function getInputChangeValue(e: ChangeEvent<HTMLInputElement>) {
  // When checkbox get value from e.target.checked
  if (e.target.name === "hasEndDate") {
    return e.target.checked;
  }

  // Otherwise get value from e.target.value
  return e.target.value;
}
