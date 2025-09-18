import { ShippingErrorCode, ShippingErrorFragment } from "@dashboard/graphql";
import { ChannelError } from "@dashboard/utils/errors";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    id: "VIABHy",
    defaultMessage: "Default shipping zone already exists",
    description: "error message",
  },
  lessThanMin: {
    id: "AdmPca",
    defaultMessage: "Max value cannot be less than min value",
    description: "error message",
  },
});

type ShippingError = Omit<ShippingErrorFragment, "__typename"> | ChannelError | undefined;

function getShippingErrorMessage(err: ShippingError, intl: IntlShape): string | undefined {
  if (err && "code" in err) {
    switch (err.code) {
      case ShippingErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.alreadyExists);
      case ShippingErrorCode.MAX_LESS_THAN_MIN:
        return intl.formatMessage(messages.lessThanMin);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getShippingErrorMessage;
