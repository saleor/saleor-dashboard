import { type WarehouseErrorFragment } from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

function getWarehouseErrorMessage(
  err: Omit<WarehouseErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getWarehouseErrorMessage;
