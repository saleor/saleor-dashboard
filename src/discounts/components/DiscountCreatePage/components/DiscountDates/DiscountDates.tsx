import React, { ChangeEvent } from "react";
import { useController } from "react-hook-form";

import DiscountDatesComponent from "../../../DiscountDates";
import { Inputs } from "../../types";

export const DiscountDates = () => {
  const { field } = useController<Inputs, "dates">({ name: "dates" });

  const handleChange = (e: ChangeEvent<any>) => {
    field.onChange({
      target: {
        name: "dates",
        value: {
          startDate: field.value.startDate,
          startTime: field.value.startTime,
          hasEndDate: field.value.hasEndDate,
          endDate: field.value.endDate,
          endTime: field.value.endTime,
          [e.target.name]:
            e.target.name === "hasEndDate" ? e.target.checked : e.target.value,
        },
      },
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
