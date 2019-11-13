import { useState } from "react";
import { useIntl } from "react-intl";

import { AddressTypeInput } from "@saleor/customers/types";
import { commonMessages } from "@saleor/intl";
import { transformFormToAddress } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { AddressInput } from "@saleor/types/globalTypes";
import { add, remove } from "@saleor/utils/lists";

interface UseAddressValidation<T> {
  errors: UserError[];
  submit: (data: T & AddressTypeInput) => void;
}

function useAddressValidation<T>(
  onSubmit: (address: T & AddressInput) => void
): UseAddressValidation<T> {
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<UserError[]>([]);

  const countryRequiredError = {
    field: "country",
    message: intl.formatMessage(commonMessages.requiredField)
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
