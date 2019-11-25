import { MutationFunction } from "react-apollo";
import { IntlShape } from "react-intl";

import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { OrderDraftCreate } from "@saleor/orders/types/OrderDraftCreate";
import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { QuickSearchAction } from "../../types";
import { searchInCommands } from "../commands";
import { searchInCustomers } from "../customers";
import { sortScores } from "../utils";
import searchInViews from "./views";

const threshold = 0.05;
const maxActions = 5;

function getDefaultModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  customers: SearchCustomers_search_edges_node[],
  createOrder: MutationFunction<OrderDraftCreate, {}>
): QuickSearchAction[] {
  const actions = [
    ...searchInViews(query, intl, navigate),
    ...searchInCommands(query, intl, navigate, createOrder)
  ]
    .filter(action => action.score >= threshold)
    .sort(sortScores)
    .slice(0, maxActions);

  if (query !== "") {
    return [...actions, ...searchInCustomers(intl, navigate, customers)];
  }

  return actions;
}

export default getDefaultModeActions;
