import { type AddressTypeInput } from "@dashboard/customers/types";
import { type ChangeEvent, type FormChange } from "@dashboard/hooks/useForm";

export const createCountryHandler =
  (currentHandler: FormChange, set: (dataSet: Partial<AddressTypeInput>) => void) =>
  (event: ChangeEvent) => {
    currentHandler(event);
    set({ countryArea: "" });
  };
