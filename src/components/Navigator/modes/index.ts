import { IntlShape } from "react-intl";

import {
  CheckIfOrderExists,
  CheckIfOrderExistsVariables
} from "../queries/types/CheckIfOrderExists";
import { QuickSearchAction, QuickSearchMode } from "../types";
import getDefaultModeActions from "./default";
import getOrdersModeActions from "./orders";
import { ActionQueries } from "./types";

function getModeActions(
  mode: QuickSearchMode,
  query: string,
  intl: IntlShape,
  queries: ActionQueries
): QuickSearchAction[] {
  switch (mode) {
    case "orders":
      return getOrdersModeActions(query, intl, queries.order);
    default:
      return getDefaultModeActions(query, intl);
  }
}

export default getModeActions;
