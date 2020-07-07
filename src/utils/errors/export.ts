import { ExportErrorFragment } from "@saleor/fragments/types/ExportErrorFragment";
import { commonMessages } from "@saleor/intl";
import { ExportErrorCode } from "@saleor/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getExportErrorMessage(
  err: Omit<ExportErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case ExportErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getExportErrorMessage;
