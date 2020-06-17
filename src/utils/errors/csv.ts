import { commonMessages } from "@saleor/intl";
import { CsvErrorFragment } from "@saleor/products/types/CsvErrorFragment";
import { CsvErrorCode } from "@saleor/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getCsvErrorMessage(
  err: Omit<CsvErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case CsvErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getCsvErrorMessage;
