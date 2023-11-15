import React, { ChangeEvent } from "react";
import { useController } from "react-hook-form";

import DiscountDatesComponent from "../../../DiscountDates";
import { CreateDiscoutFormData } from "../../types";

export const DiscountDates = () => {
  const { field } = useController<CreateDiscoutFormData, "dates">({
    name: "dates",
  });

  const handleChange = (e: ChangeEvent<any>) => {
    field.onChange({
      ...field.value,
      [e.target.name]:
        e.target.name === "hasEndDate" ? e.target.checked : e.target.value,
    });
  };

  return (
    <DiscountDatesComponent
      data={field.value}
      disabled={field.disabled}
      errors={[]}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
};
