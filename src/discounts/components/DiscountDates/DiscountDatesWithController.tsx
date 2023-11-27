import { DiscoutFormData } from "@dashboard/discounts/types";
import React, { ChangeEvent } from "react";
import { useController } from "react-hook-form";

import DiscountDates from "./DiscountDates";

interface DiscountDatesWithControllerProps {
  disabled?: boolean;
}

export const DiscountDatesWithController = ({
  disabled,
}: DiscountDatesWithControllerProps) => {
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
      errors={[]}
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
