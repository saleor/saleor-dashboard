import { AddressTypeInput } from "@dashboard/customers/types";
import { FormChange } from "@dashboard/hooks/useForm";
import { ChangeEvent } from "react";

export const createCountryHandler =
  (currentHandler: FormChange, set: (dataSet: Partial<AddressTypeInput>) => void) =>
  (event: ChangeEvent<any>) => {
    currentHandler(event);
    set({ countryArea: "" });
  };
