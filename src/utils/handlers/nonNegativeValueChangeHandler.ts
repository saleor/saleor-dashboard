import { FormChange } from "@dashboard/hooks/useForm";
import { ChangeEvent } from "react";

function createNonNegativeValueChangeHandler(change: FormChange) {
  return (event: ChangeEvent<any>) => {
    if (/^\d*(\.\d*)?$/.test(event.target.value)) {
      change(event);
    }
  };
}

export default createNonNegativeValueChangeHandler;
