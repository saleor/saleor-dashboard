import { AddressTypeInput } from "@saleor/customers/types";
import { AccountErrorFragment } from "@saleor/customers/types/AccountErrorFragment";
import { transformFormToAddress } from "@saleor/misc";
import { AccountErrorCode, AddressInput } from "@saleor/types/globalTypes";
import { add, remove } from "@saleor/utils/lists";
import { useState } from "react";

interface UseAddressValidation<T> {
  errors: AccountErrorFragment[];
  submit: (data: T & AddressTypeInput) => void;
}

function useAddressValidation<T>(
  onSubmit: (address: T & AddressInput) => void
): UseAddressValidation<T> {
  const [validationErrors, setValidationErrors] = useState<
    AccountErrorFragment[]
  >([]);

  const countryRequiredError: AccountErrorFragment = {
    __typename: "AccountError",
    code: AccountErrorCode.REQUIRED,
    field: "country"
  };

  return {
    errors: validationErrors,
    submit: (data: T & AddressTypeInput) => {
      try {
        setValidationErrors(
          remove(
            countryRequiredError,
            validationErrors,
            (a, b) => a.field === b.field
          )
        );
        onSubmit(transformFormToAddress(data));
      } catch {
        setValidationErrors(add(countryRequiredError, validationErrors));
      }
    }
  };
}

export default useAddressValidation;
