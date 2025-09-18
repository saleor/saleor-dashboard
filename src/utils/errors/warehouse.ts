import { WarehouseErrorFragment } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

function getWarehouseErrorMessage(
  err: Omit<WarehouseErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getWarehouseErrorMessage;
