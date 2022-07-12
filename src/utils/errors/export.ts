import { ExportErrorFragment } from "@saleor/graphql";
import { IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

function getExportErrorMessage(
  err: Omit<ExportErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getExportErrorMessage;
