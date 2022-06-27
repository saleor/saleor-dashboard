import { AddressTypeInput } from "@saleor/customers/types";
import {
  AccountErrorCode,
  AccountErrorFragment,
  AddressInput,
  AddressTypeEnum,
} from "@saleor/graphql";
import { transformFormToAddressInput } from "@saleor/misc";
import { add, remove } from "@saleor/utils/lists";
import { useState } from "react";

interface UseAddressValidation<TInput, TOutput> {
  errors: AccountErrorFragment[];
  submit: (
    data: TInput & AddressTypeInput,
  ) => TOutput | Promise<AccountErrorFragment[]>;
}

function useAddressValidation<TInput, TOutput>(
  onSubmit: (address: TInput & AddressInput) => TOutput,
  addressType?: AddressTypeEnum,
): UseAddressValidation<TInput, TOutput> {
  const [validationErrors, setValidationErrors] = useState<
    AccountErrorFragment[]
  >([]);

  const countryRequiredError: AccountErrorFragment = {
    __typename: "AccountError",
    code: AccountErrorCode.REQUIRED,
    field: "country",
    addressType,
    message: "Country required",
  };

  return {
    errors: validationErrors,
    submit: (data: TInput & AddressTypeInput) => {
      try {
        setValidationErrors(
          remove(
            countryRequiredError,
            validationErrors,
            (a, b) => a.field === b.field,
          ),
        );
        return onSubmit(transformFormToAddressInput(data));
      } catch {
        const errors = add(countryRequiredError, validationErrors);
        setValidationErrors(errors);
        // since every onSubmit must return Promise<error>
        return Promise.resolve(errors);
      }
    },
  };
}

export default useAddressValidation;
