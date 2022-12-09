import { AddressTypeInput } from "@saleor/customers/types";
import { FormChange } from "@saleor/hooks/useForm";
import { ChangeEvent } from "react";

export const createCountryHandler = (
  currentHandler: FormChange,
  set: (dataSet: Partial<AddressTypeInput>) => void,
) => (event: ChangeEvent<any>) => {
  currentHandler(event);
  set({ countryArea: "" });
};
