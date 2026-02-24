import { type AddressTypeInput } from "@dashboard/customers/types";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type ChangeEvent } from "react";

export const createCountryHandler =
  (currentHandler: FormChange, set: (dataSet: Partial<AddressTypeInput>) => void) =>
  (event: ChangeEvent<any>) => {
    currentHandler(event);
    set({ countryArea: "" });
  };
