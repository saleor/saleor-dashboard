import { MutationFunction } from "react-apollo";
import { IntlShape } from "react-intl";

import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { OrderDraftCreate } from "@saleor/orders/types/OrderDraftCreate";
import { QuickSearchAction, QuickSearchMode } from "../../types";
import { searchInCommands } from "../commands";
import { sortScores } from "../utils";
import searchInViews from "./views";

const threshold = 0.05;
const maxActions = 5;

function getDefaultModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  createOrder: MutationFunction<OrderDraftCreate, {}>,
  setMode: (mode: QuickSearchMode) => void
): QuickSearchAction[] {
  return [
    ...searchInViews(query, intl, navigate),
    ...searchInCommands(query, intl, navigate, createOrder, setMode)
  ]
    .filter(action => action.score >= threshold)
    .sort(sortScores)
    .slice(0, maxActions);
}

export default getDefaultModeActions;
