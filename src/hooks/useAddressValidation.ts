import { AddressTypeInput } from "@saleor/customers/types";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import { transformFormToAddress } from "@saleor/misc";
import { AccountErrorCode, AddressInput } from "@saleor/types/globalTypes";
import { add, remove } from "@saleor/utils/lists";
import { useState } from "react";

interface UseAddressValidation<TInput, TOutput> {
  errors: AccountErrorFragment[];
  submit: (data: TInput & AddressTypeInput) => TOutput;
}

function useAddressValidation<TInput, TOutput>(
  onSubmit: (address: TInput & AddressInput) => TOutput
): UseAddressValidation<TInput, TOutput> {
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
    submit: (data: TInput & AddressTypeInput) => {
      try {
        setValidationErrors(
          remove(
            countryRequiredError,
            validationErrors,
            (a, b) => a.field === b.field
          )
        );
        return onSubmit(transformFormToAddress(data));
      } catch {
        setValidationErrors(add(countryRequiredError, validationErrors));
      }
    }
  };
}

export default useAddressValidation;
