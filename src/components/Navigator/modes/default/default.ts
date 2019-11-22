import { MutationFunction } from "react-apollo";
import { IntlShape } from "react-intl";

import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { OrderDraftCreate } from "@saleor/orders/types/OrderDraftCreate";
import { QuickSearchAction } from "../../types";
import { searchInCommands } from "../commands";
import searchInViews from "./views";

const threshold = 0.05;
const maxActions = 5;

function getDefaultModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  createOrder: MutationFunction<OrderDraftCreate, {}>
): QuickSearchAction[] {
  return [
    ...searchInViews(query, intl, navigate),
    ...searchInCommands(query, intl, navigate, createOrder)
  ]
    .filter(action => action.score >= threshold)
    .sort((a, b) => (a.score <= b.score ? 1 : -1))
    .slice(0, maxActions);
}

export default getDefaultModeActions;
