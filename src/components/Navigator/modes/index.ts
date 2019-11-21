import { IntlShape } from "react-intl";

import { QuickSearchAction, QuickSearchMode } from "../types";
import getDefaultModeActions from "./default";
import getOrdersModeActions from "./orders";

function getModeActions(
  mode: QuickSearchMode,
  query: string,
  intl: IntlShape
): QuickSearchAction[] {
  switch (mode) {
    case "orders":
      return getOrdersModeActions(query, intl);
    default:
      return getDefaultModeActions(query, intl);
  }
}

export default getModeActions;
