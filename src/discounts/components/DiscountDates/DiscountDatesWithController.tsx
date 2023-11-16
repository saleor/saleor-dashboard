import { DiscoutFormData } from "@dashboard/discounts/types";
import React, { ChangeEvent } from "react";
import { useController } from "react-hook-form";

import DiscountDates from "./DiscountDates";

export const DiscountDatesWithController = () => {
  const { field } = useController<DiscoutFormData, "dates">({
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
    <DiscountDates
      data={field.value}
      disabled={!!field.disabled}
      errors={[]}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
};
