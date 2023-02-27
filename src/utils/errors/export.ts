import { ExportErrorFragment } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

function getExportErrorMessage(
  err: Omit<ExportErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getExportErrorMessage;
